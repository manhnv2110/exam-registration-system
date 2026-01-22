import './Style-StudentTable.css';
import StudentDetailModal from '../studentDetailModal/StudentDetailModal';
import EditStudentModal from '../editStudentModal/EditStudentModal';
import { FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState } from 'react';

const StudentTable = ({ students, onEdit, onDelete }) =>{
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleViewClick = (student) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedStudent(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedStudent(null);
  };
  const handleSave = (updatedData) => {
    console.log('Updated student data:', updatedData);
    onEdit(updatedData);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  
  const totalPages = Math.ceil(students.length / itemsPerPage); 
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = students.slice(startIndex, endIndex); 
  const goToPage = (page) => {
      setCurrentPage(page);
  };
  
  const goToPrevious = () => {
      if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
      }
  };
  
  const goToNext = () => {
      if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1); 
      }
  };
  return (
    <>
    <div className="student-table-container">
      <div className="student-table-wrapper">
        <table className="student-table-management">
          <thead>
            <tr className="student-table-header-row">
              <th className="student-table-header">STT</th>
              <th className="student-table-header">Mã sinh viên</th>
              <th className="student-table-header student-table-row-left">Họ và tên</th>
              <th className="student-table-header">Lớp</th>
              <th className="student-table-header">Ngày sinh</th>
              <th className="student-table-header student-table-row-left">Email</th>
              <th className="student-table-header">Số điện thoại</th>
              <th className="student-table-header">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student, index) => (
              <tr key={student.id} className="student-table-row">
                <td className="student-table-cell">{index + 1}</td>
                <td className="student-table-cell student-code">{student.code}</td>
                <td className="student-table-cell student-table-row-left">{student.name}</td>
                <td className="student-table-cell">{student.className}</td>
                <td className="student-table-cell">{student.dob}</td>
                <td className="student-table-cell student-table-row-left">{student.email}</td>
                <td className="student-table-cell">{student.phone}</td>
                <td className="student-table-cell">
                  <div className="student-table-buttons">
                    <button
                      onClick={() => handleViewClick(student)}
                      className="student-action-btn student-action-btn-view"
                      title="Xem"
                    >
                      <FaEye className="student-action-icon" />
                    </button>
                    <button
                      onClick={() => handleEditClick(student)}
                      className="student-action-btn student-action-btn-edit"
                      title="Sửa"
                    >
                      <MdEdit className="student-action-icon" />
                    </button>
                    <button
                      onClick={() => onDelete(student)}
                      className="student-action-btn student-action-btn-delete"
                      title="Xóa"
                    >
                      <FaTrashAlt className="student-action-icon" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    {totalPages > 1 && ( 
        <div className='exam-information-pagination'>
            <div className='exam-information-pagination-info'>
                Hiển thị {startIndex + 1} - {Math.min(endIndex, students.length)} của {students.length} học sinh 
            </div>
            <div className='exam-information-pagination-controls'>
                <button
                    onClick={goToPrevious}
                    disabled={currentPage === 1}
                    className='exam-information-pagination-btn'
                    title="Trang trước"
                >
                    <FaChevronLeft />
                </button>
                
                {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 2 && page <= currentPage + 2)
                    ) {
                        return (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`exam-information-pagination-number ${
                                    currentPage === page ? 'active' : ''
                                }`}
                            >
                                {page}
                            </button>
                        );
                    } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                    ) {
                        return <span key={page} className='exam-information-pagination-dots'>...</span>;
                    }
                    return null;
                })}
                
                <button
                    onClick={goToNext}
                    disabled={currentPage === totalPages}
                    className='exam-information-pagination-btn'
                    title="Trang sau"
                >
                    <FaChevronRight />
                </button>
            </div>
        </div>
    )}   
    {isDetailModalOpen && selectedStudent && (
      <StudentDetailModal 
        student={selectedStudent} 
        onClose={handleCloseDetailModal}
      />
    )}
    {isEditModalOpen && selectedStudent && (
      <EditStudentModal 
        student={selectedStudent} 
        onClose={handleCloseEditModal}
        onSubmit={onEdit}
      />
    )}
    </>
  );
} 

export default StudentTable;
