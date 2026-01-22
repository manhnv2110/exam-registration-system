import { useState, useEffect } from "react"
import Header from "../../../components/admin/header/Header"
import Sidebar from "../../../components/admin/sidebar/Sidebar"
import ExamCard from "../../../components/admin/examCard/ExamCard";
import { IoMdAdd } from "react-icons/io";
import CreateExamModal from "../../../components/admin/createExamModal/CreateExamModal";
import EditExamModal from "../../../components/admin/editExamModal/EditExamModal";
import AddExamSubjectsModal from "../../../components/admin/addExamSubjectsModal/AddExamSubjectsModal";
import './Style-ExamManagement.css'
import {examService} from "../../../services/examService"
import { courseService } from "../../../services/courseService";
import { FaClipboardList } from "react-icons/fa";

const ExamManagement = () => {
    const [isCreateExamModal, setIsCreateExamModal] = useState(false);
    const [isEditExamModal, setIsEditExamModal] = useState(false);
    const [isAddExamSubjectsModal, setIsAddExamSubjectsModal] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const loadExams = async () => {
        try {
            setLoading(true);
            const response = await examService.getAll();
            
            // Transform API data to match ExamCard format
            const transformedExams = response.map(exam => ({
                id: exam.id,
                name: exam.examName,
                startDate: formatDate(exam.startDate),
                endDate: formatDate(exam.endDate),
                status: exam.examSatus?.toLowerCase() || 'upcoming', // Lưu ý: examSatus có typo
                description: exam.description,
                totalSubjects: exam.totalSubjects || 0,
                totalSessions: exam.totalSessions || 0,
                totalRegistrations: exam.totalRegistrations || 0
            }));
            
            setExams(transformedExams);
        } catch (error) {
            console.error('Error loading exams:', error);
            alert('Lỗi khi tải danh sách kỳ thi!');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        loadExams();
        loadSubjects();
    }, []);
    const handleCreateExam = () => {
        setIsCreateExamModal(true);
    }
    const closeCreateExamModal = () => {
        setIsCreateExamModal(false);
    }
    const handleEdit = (exam) => {
        setSelectedExam(exam);
        setIsEditExamModal(true);
    };
    
    // Handler để đóng modal
    const closeEditExamModal = () => {
        setIsEditExamModal(false);
        setSelectedExam(null);
    };
    
    const handleAddSubject = async (exam) => {
        setSelectedExam(exam);
        setIsAddExamSubjectsModal(true)
        setSelectedExam(exam);
        await loadSubjectsOfExam(exam.id);
    }

    const closeAddSubject = () => {
        setIsAddExamSubjectsModal(false);
        setSelectedExam(null);
    }
    // Handler để lưu thay đổi
    const handleUpdateExam = async (updatedExam) => {
        try {
            const startDate = updatedExam.startDate.split('/').reverse().join('-');
            const endDate = updatedExam.endDate.split('/').reverse().join('-');
            
            await examService.update(updatedExam.id, {
                name: updatedExam.name,
                startDate: startDate,
                endDate: endDate,
                description: updatedExam.description
            });
            
            await loadExams();
            closeEditExamModal();
            // alert('Cập nhật kỳ thi thành công!');
        } catch (error) {
            console.error('Error updating exam:', error);
            alert('Lỗi khi cập nhật kỳ thi!');
        }
    };

    const handleSubmitExam = async (formData) => {
        try {
        await examService.add({
        examName: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description
        });

        alert("Tạo kỳ thi thành công!");
        await loadExams();
        } catch (error) {
        console.error(error);
        alert("Lỗi khi tạo kỳ thi!");
        }
    };

    const handleDelete = async (exam) => {
        if (confirm(`Bạn có chắc muốn xóa kỳ thi "${exam.name}"? Hành động này không thể hoàn tác!`)) {
            try {
                await examService.delete(exam.id);
                await loadExams();
            } catch (error) {
                console.error('Error deleting exam:', error);
                alert('Lỗi khi xóa kỳ thi!');
            }
        }
    };

    const handleClose = async (exam) => {
        if (confirm(`Bạn có chắc muốn đóng kỳ thi "${exam.name}"?`)) {
            try {
                await examService.close(exam.id);
                await loadExams();;
            } catch (error) {
                console.error('Error closing exam:', error);
                alert('Lỗi khi đóng kỳ thi!');
            }
        }
    };

    const handleOpen = async (exam) => {
        if (confirm(`Bạn có chắc muốn mở kỳ thi "${exam.name}"?`)) {
            try {
                await examService.open(exam.id);
                await loadExams();;
            } catch (error) {
                console.error('Error opening exam:', error);
                alert('Lỗi khi đóng kỳ thi!');
            }
        }
    };
    const handleViewDetail = (exam) => {
        alert(`Xem chi tiết: ${exam.name}`);
    };

    const [availableSubjects, setAvailableSubjects] = useState([]);

    const loadSubjects = async () => {
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

    const [addedSubjects, setAddedSubjects] = useState([]);

    const loadSubjectsOfExam = async (examId) => {
        try {
            const response = await examService.getSubjectsOfExam(examId);
            setAddedSubjects(response)
        } catch (error) {
            console.error("Error loading subjects of exam",error);
            alert("Lỗi khi tải danh sách môn thi đã được thêm")
        }
    }

    const refreshAddedSubjects = async () => {
    if (!selectedExam?.id) return;
    await loadSubjectsOfExam(selectedExam.id);
    await loadExams();
    };

    return (
        <div className="page">
            <Header/>
            <div className="main">
                <Sidebar/>
                <div className="content">
                    <div className="exam-management-header">
                        <h1 className="exam-management-title">Danh sách các kì thi</h1>
                        <button onClick={handleCreateExam} className="btn-add-exam">
                        <IoMdAdd className="icon-add-exam" />
                        <span>Tạo kì thi mới</span>
                        </button> 
                    </div>       
                    <div className="exam-management-list">
                        {loading ? (
                            <p>Đang tải...</p>
                        ) : exams.length > 0 ? (
                            exams.map((exam) => (
                                <ExamCard
                                    key={exam.id}
                                    exam={exam}
                                    onViewDetail={handleViewDetail}
                                    onAddSubject={handleAddSubject}
                                    onEdit={handleEdit}
                                    onClose={handleClose}
                                    onDelete={handleDelete}
                                    onOpen={handleOpen}
                                />
                            ))
                        ) : (
                            <div className="empty-exam">
                                <FaClipboardList className="empty-icon" />
                                <h2>Chưa có kỳ thi nào</h2>
                            </div>
                        )}
                    </div>       
                </div>
            </div>
            {isCreateExamModal && (<CreateExamModal
            onClose={closeCreateExamModal}
            onSubmit={handleSubmitExam}/>)}
            {isEditExamModal && selectedExam && (
                <EditExamModal
                    exam={selectedExam}
                    onClose={closeEditExamModal}
                    onSubmit={handleUpdateExam}
                />
            )}
            {isAddExamSubjectsModal && (<AddExamSubjectsModal
            onClose={closeAddSubject}
            availableSubjects={availableSubjects}
            examId={selectedExam.id}
            addedSubjects={addedSubjects}
            onAdded={refreshAddedSubjects}
            />)}
        </div>
    )
}
export default ExamManagement;