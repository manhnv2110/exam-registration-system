import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import './Style-SubjectTableExam.css';
import { useNavigate, useParams } from 'react-router-dom';

const SubjectTableExam = ({subjects, onDelete}) => {
    const navigate = useNavigate();
    const { examId } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    const totalPages = Math.ceil(subjects.length / itemsPerPage); 
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentSubjects = subjects.slice(startIndex, endIndex); 
    
    // Xử lý chuyển trang
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
            <div className='subject-table-exam-container'>
                <div className='subject-table-exam-wrapper'>
                    <table className='subject-table'>
                        <thead>
                            <tr className='subject-table-exam-header-row'>
                                <th className='subject-table-exam-header'>STT</th>
                                <th className="subject-table-exam-header">Mã môn thi</th>
                                <th className="subject-table-exam-header subject-table-exam-name">Tên môn thi</th>
                                <th className='subject-table-exam-header'>Số ca thi</th>
                                <th className='subject-table-exam-header'>Số tín chỉ</th>
                                <th className='subject-table-exam-header'>Thời lượng thi</th>
                                <th className='subject-table-exam-header'>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentSubjects.map((subject, index) => (
                                <tr key={subject.id} className='subject-table-exam-row'>
                                    <td className='subject-table-exam-cell'>
                                        {startIndex + index + 1}
                                    </td>
                                    <td className='subject-table-exam-cell subject-code'>
                                        {subject.subjectCode}
                                    </td>
                                    <td className='subject-table-exam-cell subject-table-exam-name'>{subject.name}</td>
                                    <td className='subject-table-exam-cell subject-sessions' onClick={()=>navigate(`/admin/exam-management/exam-info/${examId}/subject/${subject.id}/sessions`)}>{subject.sessions}</td>
                                    <td className='subject-table-exam-cell'>
                                        {subject.creditHour}
                                    </td>
                                    <td className='subject-table-exam-cell'>
                                        {subject.duration}
                                    </td>
                                    <td className='subject-table-exam-cell subject-action'
                                        onClick={() => onDelete(subject)}
                                    >
                                        Xóa
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && ( 
                    <div className='exam-information-pagination'>
                        <div className='exam-information-pagination-info'>
                            Hiển thị {startIndex + 1} - {Math.min(endIndex, subjects.length)} của {subjects.length} môn thi 
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
                                // Hiển thị trang đầu, cuối và các trang xung quanh trang hiện tại
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
            </div>
        </>
    );
}

export default SubjectTableExam;