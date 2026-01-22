import "./Style-SessionTable.css"
import { PiDotsThreeCircle } from "react-icons/pi";
import { useState, useEffect, useRef } from "react";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import EditExamSessionModal from "../editExamSessionModal/EditExamSessionModal";
import ViewListStudentSession from "../viewListStudentSession/ViewListStudentSession";
import { examSessionService } from "../../../services/examSessionService";


const SessionTable = ({sessions, onSave}) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [isEditExamSessionModal, setIsEditExamSessionModal] = useState(false);
    const [isViewListStudentSession, setIsViewListStudentSession] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const dropdownRef = useRef(null);

    const handleEditClick = (session) => {
        console.log("selectedSession =", session);
        setSelectedSession(session);
        setIsEditExamSessionModal(true)
    }

    const handleViewListStudent = (session) => {
        setSelectedSession(session);
        setIsViewListStudentSession(true);
    }

    const toggleDropdown = (sessionId, event) => {
        if (openDropdown === sessionId) {
            setOpenDropdown(null);
        } else {
            const rect = event.currentTarget.getBoundingClientRect();
            const dropdownWidth = 180;
            const dropdownHeight = 150; // Ước tính chiều cao dropdown
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            
            // Tính toán vị trí top
            let top = rect.bottom + 5;
            // Nếu dropdown sẽ bị tràn xuống dưới viewport, hiển thị phía trên
            if (top + dropdownHeight > viewportHeight) {
                top = rect.top - dropdownHeight - 5;
            }
            
            // Tính toán vị trí left
            let left = rect.right - dropdownWidth;
            // Nếu dropdown bị tràn ra ngoài bên trái, điều chỉnh
            if (left < 0) {
                left = rect.left;
            }
            // Nếu dropdown bị tràn ra ngoài bên phải, điều chỉnh
            if (left + dropdownWidth > viewportWidth) {
                left = viewportWidth - dropdownWidth - 10;
            }
            
            setDropdownPosition({ top, left });
            setOpenDropdown(sessionId);
        }
    };

    // Xử lý click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openDropdown && 
                !event.target.closest('.session-dropdown-menu') && 
                !event.target.closest('.session-table-action')) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdown]);

    // Xử lý khi scroll - cập nhật vị trí dropdown
    useEffect(() => {
        const handleScroll = () => {
            if (openDropdown) {
                setOpenDropdown(null); // Đóng dropdown khi scroll
            }
        };

        window.addEventListener('scroll', handleScroll, true); // true để catch cả scroll trong container
        
        return () => {
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [openDropdown]);

    const handleDeleteClick = async (sessionId) => {
        const ok = window.confirm("Bạn có chắc muốn xóa ca thi này không?");
        if (!ok) return;

        try {
        await examSessionService.delete(sessionId);
        if (onSave) {
            const newSessions = sessions.filter((s) => s.id !== sessionId);
            onSave(newSessions);
        }
        } catch (err) {
        console.error("Delete exam session error:", err);
        alert(err?.message || "Xóa ca thi thất bại!");
        }
    };

    return (
        <>
        <div className="session-table-container">
            <div className="session-table-wrapper">
                <table className="session-table">
                    <thead>
                        <tr className="session-table-row">
                            <th className="session-table-header">STT</th>
                            <th className='session-table-header'>Tên môn thi</th>
                            <th className='session-table-header'>Ngày thi</th>
                            <th className='session-table-header'>Giờ bắt đầu</th>
                            <th className='session-table-header'>Phòng thi</th>
                            <th className='session-table-header'>Địa điểm thi</th>
                            <th className='session-table-header'>Sức chứa</th>
                            <th className='session-table-header'>Trạng thái</th>
                            <th className='session-table-header'>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map((session, index) => (
                            <tr key={session.id} className="session-row">
                                <td className="session-table-cell">{index + 1}</td>
                                <td className="session-table-cell">{session.subject}</td>
                                <td className="session-table-cell">{session.date}</td>
                                <td className="session-table-cell">{session.time}</td>
                                <td className="session-table-cell">{session.room}</td>
                                <td className="session-table-cell">{session.location}</td>
                                <td className="session-table-cell">{session.capacity}</td>
                                <td className="session-table-cell">
                                    <span className={`session-status-badge ${session.registered >= session.capacity ? "session-status-full" : "session-status-available"}`}> 
                                        {session.registered >= session.capacity ? "Đã đầy" : "Còn chỗ"}
                                    </span>
                                </td>
                                <td className="session-table-cell">
                                    <div className="session-action-wrapper">
                                        <PiDotsThreeCircle 
                                            className={`session-table-action ${openDropdown === session.id ? 'active' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleDropdown(session.id, e);
                                            }}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Dropdown với position fixed */}
            {openDropdown && (
                <div 
                    ref={dropdownRef}
                    className="session-dropdown-menu"
                    style={{
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`
                    }}
                >
                    <button 
                        className="session-dropdown-item"
                        onClick={() => {
                            const session = sessions.find((s) => s.id === openDropdown);
                            if (session) handleViewListStudent(session);
                            setOpenDropdown(null);
                        }}
                    >
                        <MdOutlinePeopleAlt className="session-students-icon"/>
                        <span>Xem danh sách sinh viên</span>
                    </button>
                    <button 
                        className="session-dropdown-item"
                        onClick={() => {
                            const session = sessions.find((s) => s.id === openDropdown);
                            if (session) handleEditClick(session);
                            setOpenDropdown(null);
                        }}
                    >
                        <FaEdit className="session-edit-icon"/>
                        <span>Chỉnh sửa ca thi</span>
                    </button>
                    <button 
                        className="session-dropdown-item session-dropdown-item-danger"
                        onClick={() => {
                            const id = openDropdown;
                            setOpenDropdown(null);
                            handleDeleteClick(id);
                        }}
                    >
                        <FaTrashCan className="session-delete-icon "/>
                        <span>Xóa</span>
                    </button>
                </div>
            )}
            {isEditExamSessionModal && (<EditExamSessionModal
            onClose={() => {setIsEditExamSessionModal(false)}}
            session={selectedSession}
            onSave={onSave}/>)
            }
            {isViewListStudentSession && (<ViewListStudentSession
            onClose={() => {setIsViewListStudentSession(false)}}
            session={selectedSession}
            />)}
        </div>
        </>
    )
}
export default SessionTable;