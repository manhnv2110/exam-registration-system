import './Style-Reminder.css'
import logo_reminder from '../../../assets/logo_reminder.png'

const Reminder = () => {
  return (
    <div className='reminder'>
      <div>
        <img src={logo_reminder} alt="" />
        <span>Lưu ý</span>
      </div>
      <ul>
        <li>Vui lòng kiểm tra kỹ thông tin trước khi xác nhận</li>
        <li>Sau khi đăng ký, bạn có thể hủy và đăng ký lại nếu cần</li>
        <li>Nhớ mang theo thẻ sinh viên và phiếu báo dự thi khi đi thi</li>
      </ul>
    </div>
  )
}

export default Reminder