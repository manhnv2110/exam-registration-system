import { BrowserRouter, Router, Routes, Route, useLocation } from "react-router-dom"
import ScrollToTop from "./components/admin/scrollToTop/ScrollToTop";
import Home from "./pages/student/home/Home";
import ExamRegister from "./pages/student/examregister/ExamRegister";
import ExamSchedule from "./pages/student/examSchedule/ExamSchedule";
import StudentManagement from "./pages/admin/studentmanagement/StudentManagement";
import CourseManagement from "./pages/admin/coursemanagement/CourseManagement";
import ExamManagement from "./pages/admin/examManagement/ExamManagement";
import ExamInformation from "./pages/admin/examInformation/ExamInformation";
import SubjectSessions from "./pages/admin/subjectSessions/SubjectSessions";
import Report from "./pages/admin/report/Report";
import ExamEligibility from "./pages/admin/exameligibility/ExamEligibility";
import { Navigate } from "react-router-dom";
import Provider from "./context/MyProvider";
import StudentAccount from "./pages/student/studentAccount/StudentAccount";
import Login from "./pages/login/Login";
import { AnimatePresence } from "framer-motion";
import ExamTicket from "./pages/student/examTicket/ExamTicket";


const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to ="/login"/>}></Route>
        <Route path="/login" element={<Login />} />
        <Route path="/student/home" element={<Home/>}></Route>
        <Route path="/student/register/:subjectId" element={<ExamRegister/>}></Route>
        <Route path="/student/exam-schedule" element={<ExamSchedule/>}></Route>
        <Route path="/student/student-account" element={<StudentAccount />} />
        <Route path="/admin/student-management" element={<StudentManagement/>}></Route>
        <Route path="/admin/course-management" element={<CourseManagement/>}></Route>
        <Route path="/admin/exam-management" element={<ExamManagement/>}></Route>
        <Route path="/admin/exam-management/exam-info/:examId" element={<ExamInformation/>}></Route>
        <Route path="/admin/exam-management/exam-info/:examId/subject/:subjectId/sessions" element={<SubjectSessions/>}></Route>
        <Route path="/admin/exam-eligibility" element={<ExamEligibility/>}></Route>
        <Route path="/admin/report" element={<Report/>}></Route>
      </Routes>
    </AnimatePresence>
  )
}



const App = () => {
  return (
    <Provider> 
      <BrowserRouter>
        {/* <Routes>
          <Route path="/" element={<Navigate to ="/admin/student-management"/>}></Route>
          <Route path="/student/home" element={<Home/>}></Route>
          <Route path="/student/register" element={<ExamRegister/>}></Route>
          <Route path="/student/ticket" element={<ExamTicket/>}></Route>
          <Route path="/student/exam-schedule" element={<ExamSchedule/>}></Route>
          <Route path="/admin/student-management" element={<StudentManagement/>}></Route>
          <Route path="/admin/exam-eligibility" element={<ExamEligibility/>}></Route>
        </Routes> */}
        <ScrollToTop/>
        <AnimatedRoutes/>
      </BrowserRouter>
    </Provider>
  )
}

export default App