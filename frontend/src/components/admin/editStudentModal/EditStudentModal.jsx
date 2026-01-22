import './Style-EditStudentModal.css'
import React, { useState, useEffect } from 'react'; 

const EditStudentModal = ({ student, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    gender: '',
    className: '',
    major: '',
    faculty: '',
    phone: '',
    email: '',
    dob: '',
  });

  const normalizeDob = (dob) => {
    const m = dob.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (m) {
      const dd = String(m[1]).padStart(2, '0');
      const mm = String(m[2]).padStart(2, '0');
      const yyyy = m[3];
      return `${yyyy}-${mm}-${dd}`;
    }
  }

  useEffect(() => {
      if (student) {

        const convertGender = (gender) => {
          if (gender === 'Nam') return 'MALE';
          if (gender === 'Nữ') return 'FEMALE';
          return '';
        }
  
        setFormData({
          code: student.code,
          name: student.name,
          gender: convertGender(student.gender),
          className: student.className,
          major: student.major || '',
          faculty: student.faculty || '',
          phone: student.phone,
          email: student.email,
          dob: normalizeDob(student.dob),
        });
      }
    }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.code || !formData.name || !formData.gender || 
        !formData.className || !formData.major || !formData.faculty || 
        !formData.phone || !formData.email || !formData.dob) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Email không hợp lệ!');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    onSubmit({
        ...student,
        ...formData
    });
    onClose();
  };

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div className="edit-modal-main" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="edit-modal-header">
          <h2 className="edit-modal-title">Chỉnh sửa thông tin sinh viên</h2>
        </div>

        {/* Body */}
        <div className="edit-modal-body">
          <form className="edit-student-form">
            {/* Row 1: Mã sinh viên & Họ và tên */}
            <div className="edit-student-form-row">
              <div className="edit-student-form-group">
                <label className="edit-student-form-label">
                  Mã sinh viên <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name='code'
                  className="edit-student-form-input"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Nhập mã sinh viên"
                />
              </div>

              <div className="edit-student-form-group">
                <label className="edit-student-form-label">
                  Họ và tên <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name='name'
                  className="edit-student-form-input"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                />
              </div>
            </div>

            {/* Row 2: Giới tính & Ngày sinh */}
            <div className="edit-student-form-row">
              <div className="edit-student-form-group">
                <label className="edit-student-form-label">
                  Giới tính <span className="required">*</span>
                </label>
                <select
                  className="edit-student-form-input"
                  name='gender'
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                </select>
              </div>

              <div className="edit-student-form-group">
                <label className="edit-student-form-label">
                  Ngày sinh <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name='dob'
                  className="edit-student-form-input"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Row 3: Lớp & Số điện thoại */}
            <div className="edit-student-form-row">
              <div className="edit-student-form-group">
                <label className="edit-student-form-label">
                  Lớp <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name='className'
                  className="edit-student-form-input"
                  value={formData.className}
                  onChange={handleChange}
                  placeholder="Nhập lớp"
                />
              </div>

              <div className="edit-student-form-group">
                <label className="edit-student-form-label">
                  Số điện thoại <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name='phone'
                  className="edit-student-form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>

            {/* Row 4: Ngành & Khoa */}
            <div className="edit-student-form-row">
              <div className="edit-student-form-group">
                <label className="edit-student-form-label">
                  Ngành <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name='major'
                  className="edit-student-form-input"
                  value={formData.major}
                  onChange={handleChange}
                  placeholder="Nhập ngành học"
                />
              </div>
              
              <div className="edit-student-form-group">
                <label className="edit-student-form-label">
                  Khoa <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name='faculty'
                  className="edit-student-form-input"
                  value={formData.faculty}
                  onChange={handleChange}
                  placeholder="Nhập khoa"
                />
              </div>
            </div>

            {/* Row 5: Email */}
            <div className="edit-student-form-group">
              <label className="edit-student-form-label">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                name='email'
                className="edit-student-form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="edit-student-modal-footer">
          <button onClick={onClose} className="btn-cancel">
            Hủy
          </button>
          <button onClick={handleSubmit} className="btn-save">
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStudentModal;