import { useState, useEffect } from "react";
import Header from "../../../components/admin/header/Header";
import Sidebar from "../../../components/admin/sidebar/Sidebar"
import StudentSearchBar from "../../../components/admin/searchbar/StudentSearchBar";
import StudentTable from "../../../components/admin/studentTable/StudentTable";
import { studentService } from "../../../services/studentService";
import './Style-StudentManagement.css'
const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        setError('');
        try {
            setLoading(true);
            const response = await studentService.getAll();
            const formattedStudents = response.map(student => ({
                id: student.id,
                code: student.studentCode,
                name: student.fullname,
                gender: formatGender(student.gender),
                className: student.className,
                major: student.major,
                faculty: student.faculty,
                dob: student.dob,
                email: student.email,
                phone: student.phone
            }));
                setStudents(formattedStudents);
                setFilteredStudents(formattedStudents);
        } catch (error) {
            console.error('Error loading students:', error);
            alert('Lỗi khi tải danh sách học sinh!');
        } finally {
            setLoading(false);
        }
    };

    const handleAddStudent = async (formData) => {
        const isDuplicate = students.some(
            student => student.code.trim().toLowerCase() === formData.code.trim().toLowerCase()
        );

        if (isDuplicate) {
            alert(`Mã sinh viên "${formData.code}" đã tồn tại!`);
            return;
        }
        try {
            await studentService.addStudent({
                code: formData.code,
                name: formData.name,
                gender: formData.gender,
                className: formData.className,
                major: formData.major,
                faculty: formData.faculty,
                dob: formData.dob,
                email: formData.email,
                phone: formData.phone
            });
            alert("Thêm học sinh thành công!");
            await loadStudents();
        } catch (error) {
            console.error(error);

            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Lỗi khi thêm học sinh";

            alert(message);
        }
    };

    const formatGender = (gender) => {
        const genderMap = {
            'MALE': 'Nam',
            'FEMALE': 'Nữ',
        };
        return genderMap[gender] || gender;
    };

    const handleSearch = (query) => {
        if (!query.trim()) {
            setFilteredStudents(students);
            return;
        }

        const searchQuery = query.toLowerCase();
        const filtered = students.filter(student => 
            student.code.toLowerCase().includes(searchQuery) ||
            student.name.toLowerCase().includes(searchQuery) ||
            student.email.toLowerCase().includes(searchQuery) ||
            student.className.toLowerCase().includes(searchQuery)
        );
        setFilteredStudents(filtered);
    };
    const handleUpdateStudent = async (updatedStudent) => {
        try {
            const dob = updatedStudent.dob.split('/').reverse().join('-');

            await studentService.update(updatedStudent.id, {
                code: updatedStudent.code,
                name: updatedStudent.name,
                gender: updatedStudent.gender,
                className: updatedStudent.className,
                major: updatedStudent.major,
                faculty: updatedStudent.faculty,
                dob: dob,
                email: updatedStudent.email,
                phone: updatedStudent.phone
            })
            alert("Cập nhật thông tin học sinh thành công!")
            await loadStudents();
        } catch (error) {
            console.error('Error updating student:', error);
            alert('Lỗi khi cập nhật học sinh!');
        }
        
    }

    const handleDeleteStudent = async (student) => {
        if (confirm(`Bạn có chắc muốn xóa học sinh này ? "${student.name}"? Hành động này không thể hoàn tác!`)) {
            try {
                await studentService.delete(student.id);
                await loadStudents();
            } catch (error) {
                console.error('Error deleting student:', error);
                alert('Lỗi khi xóa học sinh!');
            }
        }
    }

    // Callback to reload students after import
    const handleImportSuccess = () => {
        loadStudents();
    };
        
    return (
        <div className="page">
            <Header/>
            <div className="main">
                <Sidebar/>
                <div className="content">
                    <StudentSearchBar
                        onSearch={handleSearch}
                        onImportSuccess={handleImportSuccess}
                        onAdd={handleAddStudent}
                    />
                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Đang tải danh sách sinh viên...</p>
                        </div>
                    ) : (
                        <StudentTable
                            students={filteredStudents}
                            onEdit={handleUpdateStudent}
                            onDelete={handleDeleteStudent}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
export default StudentManagement;