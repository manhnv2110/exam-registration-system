import { useState, useEffect } from "react";
import Header from "../../../components/admin/header/Header";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import CourseSearchbar from "../../../components/admin/searchbar/CourseSearchbar";
import SubjectTable from "../../../components/admin/subjectTable/SubjectTable";
import './Style-CourseManagement.css'
import { IoMdAdd } from "react-icons/io";
import CreateCourseModal from "../../../components/admin/createCourseModal/CreateCourseModal";
import EditCourseModal from "../../../components/admin/editCourseModal/EditCourseModal";
import apiCall from "../../../utils/api";

const CourseManagement = () => {
    const [subjectsState, setSubjectsState] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateCourseModal, setIsCreateCourseModal] = useState(false);
    const [isEditCourseModal, setIsEditCourseModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiCall('/subjects', { method: 'GET' }, true);
            console.log('API Response:', response);
            if (response.data) {
                console.log('Subjects data:', response.data);
                setSubjectsState(response.data);
            } else {
                console.log('No data in response:', response);
            }
        } catch (err) {
            setError('Failed to fetch subjects: ' + (err.message || 'Unknown error'));
            console.error('Error fetching subjects:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query.trim().toLowerCase());
    };

    const filteredSubjects = subjectsState.filter((s) => {
        const code = (s.subjectCode || s.code || '').toLowerCase();
        const name = (s.name || '').toLowerCase();
        const credits = String(s.creditHour || s.credits || '').toLowerCase();
        if (!searchQuery) return true;
        return (
            code.includes(searchQuery) ||
            name.includes(searchQuery) ||
            credits.includes(searchQuery)
        );
    });

    const handleAdd = () => {
        setIsCreateCourseModal(true);
    };

    const closeCreateCourseModal = () => {
        setIsCreateCourseModal(false);
    };

    const handleSubmitCourse = async (course) => {
        const isDuplicate = subjectsState.some((s) => {
            const codeMatch = (s.subjectCode || s.code || '').trim().toLowerCase() === course.code.trim().toLowerCase();
            const nameMatch = (s.name || '').trim().toLowerCase() === course.name.trim().toLowerCase();
            return codeMatch || nameMatch;
        });
        if (isDuplicate) {
            alert('Môn học đã tồn tại (trùng mã hoặc tên).');
            return;
        }
        try {
            const subjectData = {
                subjectCode: course.code,
                name: course.name,
                creditHour: course.credits,
                duration: course.duration,
                examId: null
            };

            const response = await apiCall('/subjects', {
                method: 'POST',
                body: JSON.stringify(subjectData)
            }, true);

            if (response.data) {
                alert('Thêm môn học thành công!');
                fetchSubjects();
                closeCreateCourseModal();
            }
        } catch (err) {
            alert('Lỗi khi thêm môn học: ' + (err.message || 'Unknown error'));
            console.error('Error creating subject:', err);
        }
    };

    const handleView = (subject) => {
        alert(`Xem thông tin: ${subject.name}`);
    };

    const handleEdit = (subject) => {
        setSelectedCourse(subject);
        setIsEditCourseModal(true);
    };

    const closeEditCourseModal = () => {
        setIsEditCourseModal(false);
        setSelectedCourse(null);
    };

    const handleUpdateCourse = async (updatedCourse) => {
        const isDuplicate = subjectsState.some((s) => {
            const sameId = s.id === selectedCourse?.id;
            if (sameId) return false;
            const codeMatch = (s.subjectCode || s.code || '').trim().toLowerCase() === updatedCourse.code.trim().toLowerCase();
            const nameMatch = (s.name || '').trim().toLowerCase() === updatedCourse.name.trim().toLowerCase();
            return codeMatch || nameMatch;
        });
        if (isDuplicate) {
            alert('Môn học đã tồn tại (trùng mã hoặc tên).');
            return;
        }
        try {
            const subjectData = {
                subjectCode: updatedCourse.code,
                name: updatedCourse.name,
                creditHour: updatedCourse.credits,
                duration: updatedCourse.duration,
                examId: null
            };

            const response = await apiCall(`/subjects/${selectedCourse.id}`, {
                method: 'PUT',
                body: JSON.stringify(subjectData)
            }, true);

            if (response.data) {
                alert('Cập nhật môn học thành công!');
                fetchSubjects();
                closeEditCourseModal();
            }
        } catch (err) {
            alert('Lỗi khi cập nhật môn học: ' + (err.message || 'Unknown error'));
            console.error('Error updating subject:', err);
        }
    };

    const handleDelete = async (subject) => {
        if (confirm(`Bạn có chắc muốn xóa môn học ${subject.name}?`)) {
            try {
                await apiCall(`/subjects/${subject.id}`, {
                    method: 'DELETE'
                }, true);

                alert('Xóa môn học thành công!');
                fetchSubjects();

            } catch (err) {
                alert('Lỗi khi xóa môn học: ' + (err.message || 'Unknown error'));
                console.error('Error deleting subject:', err);
            }
        }
    };

    if (loading) {
        return (
            <div className="page">
                <Header/>
                <div className="main">
                    <Sidebar/>
                    <div className="content">
                        <p>Loading subjects...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page">
                <Header/>
                <div className="main">
                    <Sidebar/>
                    <div className="content">
                        <p style={{color: 'red'}}>{error}</p>
                        <button onClick={fetchSubjects}>Retry</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <Header/>
            <div className="main">
                <Sidebar/>
                <div className="content">
                    <div className="course-management-header">
                        <CourseSearchbar onSearch={handleSearch} onAdd={handleAdd} />
                    </div>
                    <SubjectTable
                        subjects={filteredSubjects}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        showView={false}
                        instructorLabel="Thời lượng thi"
                        instructorKey="duration"
                    />
                    {isCreateCourseModal && (
                        <CreateCourseModal onClose={closeCreateCourseModal} onSubmit={handleSubmitCourse} />
                    )}
                    {isEditCourseModal && (
                        <EditCourseModal course={selectedCourse} onClose={closeEditCourseModal} onSubmit={handleUpdateCourse} />
                    )}
                </div>
            </div>
        </div>
    )
}
export default CourseManagement;

