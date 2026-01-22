import { useState, useEffect } from "react"
import Header from "../../../components/admin/header/Header"
import Sidebar from "../../../components/admin/sidebar/Sidebar"
import { IoMdAdd } from "react-icons/io";
import { FiArrowLeft } from "react-icons/fi";
import { FaBook } from "react-icons/fa";
import SubjectTableExam from "../../../components/admin/subjectTableExam/SubjectTableExam";
import {useParams,  useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { examService } from "../../../services/examService";
import { examSessionService } from '../../../services/examSessionService';
import AddExamSubjectsModal from "../../../components/admin/addExamSubjectsModal/AddExamSubjectsModal";
import { courseService } from "../../../services/courseService";
import './Style-ExamInformation.css'

const ExamInformation = () => {
    
    const navigate = useNavigate();
    const { examId } = useParams();
    
    const [subjects, setSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAddExamSubjectsModal, setIsAddExamSubjectsModal] = useState(false);
    const [addedSubjects, setAddedSubjects] = useState([]);
    const [availableSubjects, setAvailableSubjects] = useState([]);

    const loadFullSubjects = async () => {
        try {
            setLoading(true);
            const response = await courseService.getAll();

            setAvailableSubjects(response)
        } catch (error) {
            console.error('Error loading subjects:', error);
            alert('Lỗi khi tải danh sách học phần!');
        } finally {
            setLoading(false);
        }
    };
    const handleAddSubject = async (exam) => {
        setIsAddExamSubjectsModal(true)
        await loadSubjectsOfExam();
    }
    const loadSubjectsOfExam = async () => {
        try {
            const response = await examService.getSubjectsOfExam(examId);
            setAddedSubjects(response)
        } catch (error) {
            console.error("Error loading subjects of exam",error);
            alert("Lỗi khi tải danh sách môn thi đã được thêm")
        }
    }

    const refreshAddedSubjects = async () => {
        await loadSubjectsOfExam();
        await loadSubjects(); 
    };

    useEffect(() => {
        loadSubjects();
        loadFullSubjects();
    }, [examId]);

    const loadSubjects = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await examService.getSubjectsOfExam(examId);
            
            // Format data for table
            const formattedSubjects = await Promise.all(
            response.map(async (subject) => {
                const examSessions = await examSessionService.getExamSessionsBySubjectId(subject.id, examId);

                return {
                id: subject.id,
                subjectCode: subject.subjectCode,
                name: subject.name,
                sessions: examSessions.length,
                creditHour: subject.creditHour,
                duration: subject.duration
                };
            })
            );
            
            setSubjects(formattedSubjects);
        } catch (err) {
            console.error('Error loading subjects:', err);
            setError('Không thể tải danh sách môn thi. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const filteredSubjects = subjects.filter(subject =>
        subject.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteSubject = async (subject) => {
        if (confirm(`Bạn có chắc muốn xóa môn thi này ? "${subject.name}"? Hành động này không thể hoàn tác!`)) {
            try {
                await examService.deleteSubject(examId, subject.id);
                await loadSubjects();
            } catch (error) {
                console.error('Error deleting subject:', error);
                alert('Lỗi khi xóa môn thi!');
            }
        }
    }

    const closeAddSubject = () => {
        setIsAddExamSubjectsModal(false);
    }

    return (
        <div className="page">
            <Header/>
            <div className="main">
                <Sidebar/>
                <div className="content">
                    <div className="exam-information-header">
                        <div className="exam-information-header-left">
                            <div onClick={() => navigate("/admin/exam-management")}>
                                <FiArrowLeft />
                            </div>
                            <h1 className="exam-information-title">Danh sách môn thi</h1>
                        </div>
                        <div className="search-subject-wrapper">
                          <input
                            type="text"
                            placeholder="Tìm kiếm theo tên, mã môn thi"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-subject-input"
                          />
                          <button className="search-subject-btn">
                            <IoIosSearch className="search-subject-icon" />
                          </button>
                        </div>
                        <button onClick={handleAddSubject} className="btn-add-subject">
                          <IoMdAdd className="icon-add-subject" />
                          <span>Thêm môn thi</span>
                        </button> 
                    </div> 
                    {loading ? (
                        <div className="exam-information-loading">
                        </div>
                    ): filteredSubjects.length === 0 ? (
                        <div className="exam-information-empty">
                            <FaBook className="exam-information-empty-icon"/>
                            <p className="exam-information-empty-text">
                                {searchTerm ? "Không tìm thấy môn thi phù hợp" : "Chưa có môn thi nào"}
                            </p>
                        </div>
                    ) : (
                        <SubjectTableExam
                        subjects={filteredSubjects}
                        onDelete={handleDeleteSubject}/>
                    )}
                </div>
            </div>
            {isAddExamSubjectsModal && (<AddExamSubjectsModal
            onClose={closeAddSubject}
            availableSubjects={availableSubjects}
            examId={examId}
            addedSubjects={addedSubjects}
            onAdded={refreshAddedSubjects}
            />)}
        </div>
    )
}
export default ExamInformation;

