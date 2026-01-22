import Header from "../../../components/student/header/Header";
import Notification from "../../../components/student/notification/Notification";
import Subject from "../../../components/student/subject/Subject";
import './Style-Home.css'
import { useContext, useEffect, useState } from "react";
import { motion } from 'framer-motion'
import { useSubjectStatus } from "../../../hooks/useSubjectStatus";
import MyContext from "../../../context/MyContext";
import { IoCalendarClearOutline } from "react-icons/io5";

const Home = () => {

  const { getSubjectStatus } = useSubjectStatus()
  const [subjects, setSubjects] = useState([])
  const { openExam } = useContext(MyContext)

  useEffect(() => {
    if (!openExam.id) return;

    const fetchData = async () => {
      try {
        const subjects = await getSubjectStatus(openExam.id)
        setSubjects(subjects)
      } catch (error) {
        console.error("Failed to load subject status", error)
      }
    }
    fetchData()
  }, [openExam]) 

  const NoExamState = () => (
    <div className="no-exam-wrapper">
      <div className="no-exam-content">
        <div className="no-exam-icon-wrapper">
          <IoCalendarClearOutline className="no-exam-icon"/>
        </div>
        <h3>Chưa có đợt thi</h3>
        <p>Hiện tại hệ thống chưa mở đợt đăng ký thi nào.<br/>Vui lòng quay lại sau.</p>
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -200 }}
      transition={{ duration: 0.4 }}
    >
      <div className="home-container">
        <Header/>
        
        {/* Logic hiển thị có điều kiện */}
        {!openExam.id ? (
            <NoExamState />
        ) : (
            <>
                <div className="notification-wrapper">
                <Notification exam={openExam} />
                </div>
                <div className="subjects">
                {
                    subjects.map(subject => (
                    <Subject key={subject.id} data={subject} />
                    ))
                }
                </div>
            </>
        )}
      </div>
    </motion.div>
  )
}

export default Home;