import Header from "../../../components/student/header/Header"
import Schedule from "../../../components/student/schedule/Schedule"
import './Style-ExamSchedule.css'
import { motion } from "framer-motion"
import { FaCalendarDays } from "react-icons/fa6";
import { useContext, useEffect, useRef, useState } from "react"
import { useExamRegistration } from "../../../hooks/useExamRegistration"
import MyContext from "../../../context/MyContext"
import Ticket from "../../../components/student/ticket/Ticket"
import Spinner from "../../../components/student/spinner/Spinner"
import { FaInbox } from "react-icons/fa6";

const ExamSchedule = () => {

  const ticketRef = useRef()

  const [loading, setLoading] = useState(false)
  const { getExamRegistrations, cancelExamRegistration } = useExamRegistration()
  const {
    openExam,
    examRegistrations, 
    setExamRegistrations,
    setSelectedSubject,
    setSelectedLocation,
    selectedExamSession,
    setSelectedExamSession
  } = useContext(MyContext)

  const handleExportPdfSchedule = (examRegistration, mode) => {
    setSelectedExamSession(examRegistration.examSession)
    setSelectedLocation(examRegistration.examSession.room.location)
    setSelectedSubject(examRegistration.examSession.subjectStatus.subject)
    setTimeout(() => {
      if (ticketRef.current) {
        ticketRef.current.exportPdf(mode)
      }
    }, 300)
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const examRegistrations = await getExamRegistrations(openExam.id)
        setExamRegistrations(examRegistrations)
      } catch (error) {
        console.error("Failed to load exam registrations", error)
      }
    }
    fetchData()
  }, [openExam.id])

  const handleCancel = async (examRegistrationId) => {
    try {
      setLoading(true)
      await cancelExamRegistration(examRegistrationId)
      setLoading(false)
      setTimeout(() => {
        alert('Huỷ đăng kí thành công')
      }, 500)
      const updated = await getExamRegistrations(openExam.id)
      setExamRegistrations(updated)
    } catch (error) {
      console.error('Failed to cancel exam registration', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
    >
    <div className={`exam-schedule ${loading ? 'blur' : ''}`}>
      <Header/>
      <div className="schedule-header-wrapper">
        <div className="schedule-header">
          <div className="part1">
            <div className="schedule-header-icon">
              <FaCalendarDays className="schedule-icon"/>
            </div>
            <div className="schedule-header-text">
              <h1 className="schedule-header-title">Lịch thi của tôi</h1>
              <p className="schedule-header-subtitle">Học kỳ I - Năm học 2024-2025</p>
            </div>
          </div>
          <div className="part2">
            <p className="schedule-header-total-session">Số ca thi</p>
            <h2 className="schedule-header-total-number">{examRegistrations.length}</h2>
          </div>
        </div>
      </div>
      {examRegistrations.length === 0 ? (
        <div className="schedule-empty-state">
          <motion.div 
            className="schedule-empty-state-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="schedule-empty-icon-wrapper">
              <FaInbox className="schedule-empty-icon"/>
            </div>
            <h2 className="schedule-empty-title">Chưa có ca thi nào</h2>
            <p className="schedule-empty-description">
              Bạn chưa đăng ký ca thi nào. Hãy đăng ký ca thi để xem lịch thi của bạn tại đây.
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="schedule-cards">
          {
            examRegistrations.map((examRegistration) => (
              <Schedule
                key={examRegistration.id}
                data={examRegistration}
                onCancel={handleCancel}
                onDownload={() => handleExportPdfSchedule(examRegistration, "download")}
                onPrint={() => handleExportPdfSchedule(examRegistration, "print")}
              />
            ))
          }
        </div>
      )}
    </div>
    {
      selectedExamSession && (
        <div style={{visibility:'hidden', position:'absolute', left:'-9999px'}}>
          <Ticket ref={ticketRef}/>
        </div>
      )
    }
    {
      loading && (
        <div className="cancel-examsession-spinner">
          <Spinner/>
        </div>
      )
    }
    </motion.div>
  )
}

export default ExamSchedule