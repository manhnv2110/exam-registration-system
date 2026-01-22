const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const API_URL = API_BASE_URL + "/api/v1"

console.log('API_URL:', API_URL) // Debug log


const apiCall = async (endpoint, options = {}, useAuth = true) => {
  const token = localStorage.getItem('token')
  let config  = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(useAuth && token ? {Authorization: `Bearer ${token}`} : {}),
      ...options.headers
    }
  }

  try {
    console.log('Calling API:', `${API_URL}${endpoint}`) // Debug log
    const response = await fetch(`${API_URL}${endpoint}`, config)

    // Kiểm tra content-type trước khi parse JSON
    const contentType = response.headers.get('content-type')
    let data
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const textData = await response.text()
      data = textData ? { message: textData } : {}
    }

    if (!response.ok && response.status !== 401) {
      throw {...data, status: response.status}
    }


    if (response.status === 401 && useAuth) {
      const refreshToken = localStorage.getItem('refreshToken')
      const user = JSON.parse(localStorage.getItem('user') || '{}')

      if (!refreshToken || user.role !== 'ADMIN') {
        logout()
        window.alert("Phiên đăng nhập đã hết hạn")
        throw new Error('Phiên đăng nhập đã hết hạn')
      }

      const newTokens = await refreshAccessToken(refreshToken)
      console.log(newTokens)
      config = { 
        ...config, 
        headers: {
          ...config.headers,
          Authorization: `Bearer ${newTokens.token}`
        } 
      }
      const retryResponse = await fetch(`${API_URL}${endpoint}`, config)
      
      // Kiểm tra content-type cho retry response
      const retryContentType = retryResponse.headers.get('content-type')
      let retryData
      if (retryContentType && retryContentType.includes('application/json')) {
        retryData = await retryResponse.json()
      } else {
        const retryTextData = await retryResponse.text()
        retryData = retryTextData ? { message: retryTextData } : {}
      }

      if (!retryResponse.ok) {
        throw {...retryData, status: retryResponse.status}
      }

      return retryData
    }

    return data
  } catch (e) {
    throw e
  }
}

const refreshAccessToken = async (refreshToken) => {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({refreshToken})
  })

  if (!response.ok) {
    logout()
    throw new Error('Hết phiên đăng nhập')
  }

  const result = await response.json()
  localStorage.setItem('token', result.data.token)
  localStorage.setItem('refreshToken', result.data.refreshToken)
  return result.data // Trả về object đầy đủ thay vì chỉ token
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

export default apiCall
