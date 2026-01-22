import { forwardRef, useContext, useImperativeHandle } from 'react'
import './Style-Ticket.css'
import MyContext from '../../../context/MyContext'
import logo_university from '../../../assets/logo_university_no_bg.png'
import logo_reminder_ticket from '../../../assets/logo_reminder_ticket.png'
import logo_schedule from '../../../assets/calendar.png'
import logo_download from '../../../assets/logo_download.png'
import logo_print from '../../../assets/logo_print.png'
import logo_register from '../../../assets/logo_register.png'
import { useNavigate } from 'react-router-dom'
import pdfMake from "pdfmake/build/pdfmake"
import "pdfmake/build/vfs_fonts"

const Ticket = forwardRef((props, ref) => {

  const navigate = useNavigate()

  const {
    user,
    selectedSubject,
    selectedLocation, 
    setSelectedLocation,
    selectedExamSession,
    setSelectedExamSession
  } = useContext(MyContext)

  const toBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };


  const handleExportPDF = async (mode) => {
    const logoBase64 = await toBase64(logo_university);

    const docDefinition = {
      pageSize: "A5",
      pageMargins: [30, 30, 30, 30],
      content: [
        {
          image: logoBase64,
          width: 60,
          alignment: "center",
          margin: [0, 0, 0, 10]
        },
        {
          text: "Trường Đại học Công Nghệ",
          style: "header"
        },
        {
          text: "PHIẾU BÁO DỰ THI",
          style: "title",
          margin: [0, 4, 0, 20]
        },
        {
          table: {
            widths: [120, "*"],
            body: [
              ["Họ và tên:", { text: user.fullname, alignment: "right" }],
              ["Mã sinh viên:", { text: user.studentCode, alignment: "right" }],
              ["Học phần:", { text: selectedSubject.name, alignment: "right" }],
              ["Mã học phần:", { text: selectedSubject.subjectCode, alignment: "right" }],
              ["Ngày thi:", { text: selectedExamSession.date, alignment: "right" }],
              ["Giờ thi:", { text: selectedExamSession.startTime, alignment: "right" }],
              ["Phòng thi:", { text: selectedExamSession.room.name, alignment: "right" }],
              ["Địa điểm thi:", { text: selectedLocation.name, alignment: "right" }],
              ["Thời lượng bài thi:", { text: `${selectedSubject.duration} phút`, alignment: "right" }]
            ]
          },
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0,
            hLineColor: () => "#ccc",
            paddingLeft: () => 4,
            paddingRight: () => 4,
            paddingTop: () => 6,
            paddingBottom: () => 6
          },
          margin: [0, 0, 0, 20]
        },
        {
          text: "Lưu ý: Sinh viên mang theo phiếu này và thẻ sinh viên khi đi thi",
          style: "note"
        }
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          alignment: "center",
          color: "#1f2937"
        },
        title: {
          fontSize: 16,
          bold: true,
          alignment: "center",
          decoration: "underline",
          color: "#2563eb"
        },
        note: {
          fontSize: 10,
          italics: true,
          alignment: "center",
          color: "#6b7280"
        }
      }
    };

    if (mode === "download") {
      pdfMake.createPdf(docDefinition).download(`Phiếu-dự-thi-${selectedSubject.name}-${selectedSubject.subjectCode}.pdf`);
    } else {
      pdfMake.createPdf(docDefinition).print();
    }S
  };

  useImperativeHandle(ref, () => ({
    exportPdf: handleExportPDF
  }))

  return (
    <div className='dialog-ticket'>
      <div className='dialog-ticket-content' onClick={(e) => e.stopPropagation()}>
        <div id='ticket' className='ticket'>
          <div className='ticket-header'>
            <img src={logo_university} alt="" className='ticket-logo'/>
            <h1 className='ticket-university'>Trường Đại học Công Nghệ</h1>
            <h2 className='ticket-title'>PHIẾU BÁO DỰ THI</h2>
          </div>
          <div className='ticket-info'>
            <div className='ticket-sub-info'>
              <label>Họ và tên:</label>
              <span>{user.fullname}</span>
            </div>
            <div className='ticket-sub-info'>
              <label>Mã sinh viên:</label>
              <span>{user.studentCode}</span>
            </div>
            <div className='ticket-sub-info'>
              <label>Môn thi:</label>
              <span>{selectedSubject.name}</span>
            </div>
            <div className='ticket-sub-info'>
              <label>Mã môn thi:</label>
              <span>{selectedSubject.subjectCode}</span>
            </div>
            <div className='ticket-sub-info'>
              <label>Ngày thi:</label>
              <span>{selectedExamSession.date}</span>
            </div>
            <div className='ticket-sub-info'>
              <label>Giờ thi:</label>
              <span>{selectedExamSession.startTime}</span>
            </div>
            <div className='ticket-sub-info'>
              <label>Phòng thi:</label>
              <span>{selectedExamSession.room.name}</span>
            </div>
            <div className='ticket-sub-info'>
              <label>Địa điểm thi:</label>
              <span>{selectedLocation.name}</span>
            </div>
            <div className='ticket-sub-info'>
              <label>Thời lượng bài thi:</label>
              <span>{`${selectedSubject.duration} phút`}</span>
            </div>
          </div>
          <div className='reminder-ticket'>
            <img src={logo_reminder_ticket} alt="" className='reminder-icon'/>
            <span>
              <strong>Lưu ý:</strong> Sinh viên mang theo phiếu này và thẻ sinh viên khi đi thi. 
              Vui lòng có mặt trước giờ thi 15 phút để làm thủ tục dự thi.
            </span>
          </div>
        </div>
        <div className='options'>
          <div className='option option-schedule' onClick={() => navigate('/student/exam-schedule')}>
            <img src={logo_schedule} alt="" />
            <span>Xem lịch thi</span>
          </div>
          <div className='option option-download' onClick={() => handleExportPDF("download")}>
            <img src={logo_download} alt="" />
            <span>Tải xuống</span>
          </div>
          <div className='option option-print' onClick={() => handleExportPDF("print")}>
            <img src={logo_print} alt="" />
            <span>In phiếu</span>
          </div>
          <div className='option option-register-subject' onClick={() => navigate('/student/home')}>
            <img src={logo_register} alt="" />
            <span>Đăng ký môn thi khác</span>
          </div>
        </div>
      </div>
    </div>
  )
})

export default Ticket