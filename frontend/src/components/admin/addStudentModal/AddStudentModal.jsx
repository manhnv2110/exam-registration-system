import './Style-AddStudentModal.css'
import React, { useState } from 'react'; 
import { studentService } from '../../../services/studentService';

const AddStudentModal = ({ onClose, onSubmit}) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    gender: '',
    className: '',
    major: '',
    faculty: '',
    phone: '',
    email: '',
    dob: ''
  });

  const handleInputChange = (e) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    onSubmit(formData);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setFormData ({
      code: '',
      name: '',
      gender: '',
      className: '',
      major: '',
      faculty: '',
      phone: '',
      email: '',
      dob: ''
    });
    onClose();
  };

  return (
    <div className="add-modal-overlay" onClick={onClose}>
      <div className="add-modal-main" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="add-modal-header">
          <h2 className="add-modal-title">Thêm sinh viên mới</h2>
        </div>

        {/* Body */}
        <div className="add-modal-body">
          <form onSubmit={handleSubmit} className="add-student-form">
            {/* Row 1: Mã sinh viên & Họ và tên */}
            <div className="add-student-form-row">
              <div className="add-student-form-group">
                <label className="add-student-form-label">
                  Mã sinh viên <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  className="add-student-form-input"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="Nhập mã sinh viên"
                />
              </div>

              <div className="add-student-form-group">
                <label className="add-student-form-label">
                  Họ và tên <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="add-student-form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                />
              </div>
            </div>

            {/* Row 2: Giới tính & Ngày sinh */}
            <div className="add-student-form-row">
              <div className="add-student-form-group">
                <label className="add-student-form-label">
                  Giới tính <span className="required">*</span>
                </label>
                <select
                  name='gender'
                  className="add-student-form-input"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                </select>
              </div>

              <div className="add-student-form-group">
                <label className="add-student-form-label">
                  Ngày sinh <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name='dob'
                  className="add-student-form-input"
                  value={formData.dob}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Row 3: Lớp & Số điện thoại */}
            <div className="add-student-form-row">
              <div className="add-student-form-group">
                <label className="add-student-form-label">
                  Lớp <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name='className'
                  className="add-student-form-input"
                  value={formData.className}
                  onChange={handleInputChange}
                  placeholder="Nhập lớp"
                />
              </div>

              <div className="add-student-form-group">
                <label className="add-student-form-label">
                  Số điện thoại <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name='phone'
                  className="add-student-form-input"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>
            {/* Row 4: Khoa & Ngành */}
            <div className="add-student-form-row">
              <div className="add-student-form-group">
                  <label className="add-student-form-label">
                    Ngành <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name='major'
                    className="add-student-form-input"
                    value={formData.major}
                    onChange={handleInputChange}
                    placeholder="Nhập ngành học"
                  />
              </div>

              <div className="add-student-form-group">
                <label className="add-student-form-label">
                  Khoa <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name='faculty'
                  className="add-student-form-input"
                  value={formData.faculty}
                  onChange={handleInputChange}
                  placeholder="Nhập khoa"
                />
              </div>
            </div>

            {/* Row 5: Email */}
            <div className="add-student-form-group">
              <label className="add-student-form-label">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                name='email'
                className="add-student-form-input"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Nhập email"
              />
            </div>

            <div className="add-student-modal-footer">
              <button onClick={onClose} className="btn-cancel">
                Hủy
              </button>
              <button type='submit' className="btn-add" >
                Thêm học sinh
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;