import { useEffect, useState } from "react"
import MyContext from "./MyContext"

const MyProvider = ({children}) => {

  const [user, setUser] = useState(null)
  const [isAuthLoaded, setIsAuthLoaded] = useState(false)
  const [openExam, setOpenExam] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedExamSession, setSelectedExamSession] = useState(null)
  const [examRegistrations, setExamRegistrations] = useState([])

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsAuthLoaded(true)
  }, [])

  useEffect(() => {
    const storedExam = localStorage.getItem('exam')
    if (storedExam) {
      setOpenExam(JSON.parse(storedExam))
    }
  }, [])

  useEffect(() => {
    const storedSubject = localStorage.getItem("selectedSubject")
    if (storedSubject) {
      setSelectedSubject(JSON.parse(storedSubject))
    }
  }, [])

  if (!isAuthLoaded) {
    return <div>Loading...</div>
  }

  const values = {
    user,
    setUser,
    openExam,
    setOpenExam,
    selectedSubject,
    setSelectedSubject,
    selectedLocation,
    setSelectedLocation,
    selectedExamSession,
    setSelectedExamSession,
    examRegistrations,
    setExamRegistrations
  }

  return (
    <MyContext.Provider value={values}>
      {children}
    </MyContext.Provider>
  )
}

export default MyProvider