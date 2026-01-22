import Header from '../../../components/student/header/Header';
import SelectedSubject from '../../../components/student/selectedSubject/SelectedSubject';
import './Style-ExamRegister.css'
import logo_location from '../../../assets/logo_location.png'
import Location from '../../../components/student/location/Location';
import ExamSession from '../../../components/student/examSession/ExamSession';
import logo_exam_session from '../../../assets/logo_exam_session.png'
import { useContext, useEffect, useMemo, useState } from 'react';
import SelectedLocation from '../../../components/student/selectedLocation/SelectedLocation';
import SelectExamSession from '../../../components/student/selectedExamSession/SelectedExamSession';
import Reminder from '../../../components/student/reminder/Reminder';
import { useNavigate, useParams } from 'react-router-dom';
import MyContext from '../../../context/MyContext';
import { motion, AnimatePresence } from 'framer-motion'
import Ticket from '../../../components/student/ticket/Ticket';
import { useExamSession } from '../../../hooks/useExamSession';
import Spinner from '../../../components/student/spinner/Spinner';


const ExamRegister = () => {

  const { getExamSessionsBySubjectId, registerExamSession } = useExamSession()
  const {subjectId} = useParams()
  const [examSessions, setExamSessions] = useState([])

  const [step, setStep] = useState(1)
  const [showLocationWarning, setShowLocationWarning] = useState(false)
  const [showExamSessionWarning, setShowExamSessionWarning] = useState(false)
  const [showTicket, setShowTicket] = useState(false)
  const [loading, setLoading] = useState(false)


  const {
    openExam,
    selectedSubject,
    selectedLocation, 
    setSelectedLocation,
    selectedExamSession,
    setSelectedExamSession
  } = useContext(MyContext)

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const examSessionsBySubjectId = await getExamSessionsBySubjectId(subjectId, openExam.id)
        setExamSessions(examSessionsBySubjectId)
      } catch (error) {
        console.error("Failed to load exam sessions", error)
      }
    }
    fetchData()
  }, [])

  const locs = Array.from(
      new Map(examSessions.map(es => [
        es.room.location.id, 
        { ...es.room.location, status: es.status}
      ])
    ).values()
  )

  const toggleLocation = (loc) => {
    if (loc.status === "AVAILABLE") {
      selectedLocation?.id == loc.id ? setSelectedLocation(null) : setSelectedLocation(loc)
    }
  }

  const handleSelectLocationButton = () => {
    if (selectedLocation !== null) {
      setStep(step + 1)
    } else {
      setShowLocationWarning(true)
      setTimeout(() => {
        setShowLocationWarning(false)
      }, 1000)
      return
    }
  }

  const filteredSessionsBySelectedLocation = useMemo(() => {
    return examSessions.filter(es => es.room.location.id === selectedLocation?.id)
  }, [examSessions, selectedLocation])

  const toggleExamSession = (examSession) => {
    if (examSession.status === "AVAILABLE") {
      selectedExamSession?.id == examSession.id ? setSelectedExamSession(null) : setSelectedExamSession(examSession)
    }
  }

  const handleSelectExamSessionButton = () => {
    if (selectedExamSession !== null) {
      setStep(step + 1)
    } else {
      setShowExamSessionWarning(true)
      setTimeout(() => {
        setShowExamSessionWarning(false)
      }, 1000)
      return 
    }
  }

  const handleExamSessionRegister = async () => {
    try {
      setLoading(true)
      await registerExamSession(selectedExamSession.id)
      setLoading(false)
      window.alert("Đăng kí ca thi thành công")
      setShowTicket(true)
    } catch(error) {
      console.error("Failed to register: ", error)
      window.alert(`Đăng kí ca thi thất bại \n ${error.response.data.message}`)
    }
  }

  // Animation variants cho các bước
  const stepVariants = {
    initial: { 
      opacity: 0, 
      x: 100,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      x: -100,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: [0.55, 0.085, 0.68, 0.53] // easeInQuad
      }
    }
  }

  // Animation cho warning messages
  const warningVariants = {
    initial: { 
      opacity: 0, 
      y: -20,
      scale: 0.8
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  }

  // Animation cho ticket và loading
  const overlayVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  }

  const ticketVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transition: { duration: 0.2 }
    }
  }


  return (
    <>
      <Header/>
      <div className={`exam-register ${(showTicket || loading) ? 'blurred' : ''}`}>
        <SelectedSubject subject={selectedSubject}/>

        <AnimatePresence mode='wait'>
        {
          step === 1 && (
            <motion.div
              key='step-1'
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className='select-location'>
                <div className='pos'>
                  <img src={logo_location} alt="" />
                  <span>Lựa chọn địa điểm thi</span>
                </div>

                <div className='locations'>
                  {
                    locs.map((loc, index) => (
                      <motion.div
                        key={loc.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          delay: index * 0.08,
                          duration: 0.4,
                          ease: "easeOut"
                        }}
                      >
                        <Location
                          data={loc}
                          subjectId = {subjectId}
                          isSelected={selectedLocation?.id === loc.id}
                          onSelect={() => toggleLocation(loc)}
                        />
                      </motion.div>
                    ))
                  }
                </div>
              </div>
              <motion.button 
                onClick={() => handleSelectLocationButton()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Tiếp theo
              </motion.button>
              <AnimatePresence>
                {
                  showLocationWarning && (
                    <motion.div 
                      className='location-warning'
                      variants={warningVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      Vui lòng chọn địa điểm thi
                    </motion.div>
                  )
                }
              </AnimatePresence>
            </motion.div>      
          )
        }
        </AnimatePresence>
        
        <AnimatePresence mode='wait'>
        {
          step === 2 && (
            <motion.div
              key='step-2'
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <SelectedLocation setStep={setStep} location={selectedLocation}/>
              <div className='select-exam-session'>
                <div className='session'>
                  <img src={logo_exam_session} alt="" className='select-exam-session-icon'/>
                  <span>Lựa chọn ca thi</span>
                </div>
                <div className='exam-sessions'>
                  {
                    filteredSessionsBySelectedLocation.map((e, index) => (
                      <motion.div
                        key={e.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          delay: index * 0.08,
                          duration: 0.4,
                          ease: "easeOut"
                        }}
                      >
                        <ExamSession
                          data={e}
                          isSelected={selectedExamSession?.id === e.id}
                          onSelect={() => toggleExamSession(e)}
                        />
                      </motion.div>
                    ))
                  }
                </div>
              </div>
              <motion.button 
                onClick={() => handleSelectExamSessionButton()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Tiếp theo
              </motion.button>
              <AnimatePresence>
                {
                  showExamSessionWarning && (
                    <motion.div 
                      className='exam-session-warning'
                      variants={warningVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      Vui lòng chọn ca thi
                    </motion.div>
                  )
                }
              </AnimatePresence>
            </motion.div>
          )
        }
        </AnimatePresence>

        <AnimatePresence mode='wait'>
        {
          step === 3 && (
            <motion.div
              key='step-3'
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <SelectedLocation setStep={setStep} location={selectedLocation}/>
              <SelectExamSession setStep={setStep} examSession={selectedExamSession}/>
              <Reminder/>
              <motion.button 
                onClick={handleExamSessionRegister}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Xác nhận và đăng kí
              </motion.button>
            </motion.div>
          )
        }
        </AnimatePresence>
      </div>
      
      {showTicket && 
      (<Ticket/>)}
      
      <AnimatePresence>
        {
          loading && (
            <motion.div 
              className='register-spinner'
              variants={overlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Spinner/>
            </motion.div>
          )
        }
      </AnimatePresence>
    </>
  )
}

export default ExamRegister;