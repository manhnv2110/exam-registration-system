import { User } from "../pages/models/User"

export const userService = {
  getCurrentUser: () => {
    const userJson = localStorage.getItem('user')
    if (!userJson) return null
    return User.fromJSON(JSON.parse(userJson))
  }
}