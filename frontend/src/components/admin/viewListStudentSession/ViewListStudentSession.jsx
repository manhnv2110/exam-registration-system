import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaUserGraduate, FaSearch } from "react-icons/fa";
import { examRegistrationService } from "../../../services/examRegistrationService";
import "./Style-ViewListStudentSession.css";
import pdfMake from "pdfmake/build/pdfmake"
import "pdfmake/build/vfs_fonts"

const ViewListStudentSession = ({ session, onClose }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await examRegistrationService.getStudentsbyExamSession(session.id);
        setStudents(response);
      } catch (error) {
        console.error("Error fetching students:", error);
        alert("Không thể tải danh sách sinh viên. Vui lòng thử lại!");
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    if (session && session.id) {
      fetchStudents();
    }
  }, [session])

  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentCode.includes(searchTerm) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //xuat danh sach ra pdf
  const handleExportCustomPDF = () => {
    const tableBody = [
      ["STT", "MSSV", "Họ và tên", "Email", "SĐT", "Thời gian đăng ký"],
      ...students.map((s, i) => [ 
        i + 1,
        s.studentCode, 
        s.fullName, 
        s.email, 
        s.phone, 
        s.registeredAt 
      ])
    ]
  
    const docDefinition = {
      pageSize: "A4",
      pageOrientation: "landscape",
      pageMargins: [30, 40, 30, 40],
      header: {
        text: "Trường đại học công nghệ",
        alignment: "center",
        fontSize: 12,
        bold: true,
        margin: [0, 10]
      },
      footer: function(currentPage, pageCount) {
        return {
          columns: [
            { text: `Ngày xuất: ${new Date().toLocaleDateString()}`, alignment: "left", margin: [30, 0] },
            { text: `Trang ${currentPage} / ${pageCount}`, alignment: "right", margin: [0, 0, 30, 0] }
          ],
          fontSize: 9
        }
      },
      content: [
        { text: "Danh sách sinh viên đã đăng ký", style: "title", margin: [0, 0, 0, 8] },
        { text: `${session.subject} - ${session.time} - ${session.date} - ${session.room} - ${session.location}`, style: "sub", margin: [0, 0, 0, 12] },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "auto", "*", "*", "auto", "auto"],
            body: tableBody
          },
          layout: 'lightHorizontalLines'
        }
      ],
      styles: {
        title: {fontSize: 14, bold: true},
        sub: { fontSize: 10, italics: true}
      }
    }

    pdfMake.createPdf(docDefinition).download("danh-sach-dang-ky.pdf")
  }
  return (
    <div className="view-list-student-session-overlay" onClick={onClose}>
      <div className="view-list-student-session-container" onClick={(e) => e.stopPropagation()}>
        <div className="view-list-student-session-header">
          <div className="view-list-student-session-title-section">
            <FaUserGraduate className="view-list-student-session-icon" />
            <div>
              <h2 className="view-list-student-session-title">Danh sách sinh viên đã đăng ký</h2>
              <p className="view-list-student-session-subtitle">
                {session.subject} - {session.time} - {session.date} - {session.room} - {session.location}
              </p>
            </div>
          </div>
          <button className="view-list-student-session-close-btn" onClick={onClose}>
            <IoClose />
          </button>
        </div>

        <div className="view-list-student-session-body">
          <div className="view-list-student-info-bar">
            <div className="view-list-student-count-badge">
              <span className="view-list-student-count-label">Đã đăng ký:</span>
              <span className="view-list-student-count-number">{students.length}/{session.capacity}</span>
            </div>
            
            <div className="view-list-student-search-box">
              <FaSearch className="view-list-student-search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, MSSV, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="view-list-student-search-input"
              />
            </div>
          </div>

          {loading ? (
            <div className="view-list-student-loading">
              <div className="view-list-student-loading-spinner"></div>
              <p>Đang tải danh sách sinh viên...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="view-list-student-empty">
              <FaUserGraduate className="view-list-student-empty-icon" />
              <p className="view-list-student-empty-text">
                {searchTerm ? "Không tìm thấy sinh viên phù hợp" : "Chưa có sinh viên đăng ký"}
              </p>
            </div>
          ) : (
            <div className="view-list-student-table-wrapper">
              <table className="view-list-student-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>MSSV</th>
                    <th>Họ và tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Thời gian đăng ký</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr key={student.id}>
                      <td className="STT">{index + 1}</td>
                      <td className="view-list-student-table-id">{student.studentCode}</td>
                      <td className="view-list-student-table-name">{student.fullName}</td>
                      <td>
                        <div className="view-list-student-table-contact">
                          {student.email}
                        </div>
                      </td>
                      <td>
                        <div className="view-list-student-table-contact">
                          {student.phone}
                        </div>
                      </td>
                      <td className="view-list-student-table-time">{student.registeredAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="view-list-student-session-footer">
          <button className="view-list-student-btn-secondary" onClick={onClose}>
            Đóng
          </button>
          <button className="view-list-student-btn-primary" onClick={handleExportCustomPDF}>
            Xuất danh sách
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewListStudentSession;