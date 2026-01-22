import { useState, useEffect } from 'react';
import { IoIosClose } from "react-icons/io";
import './Style-EditExamModal.css';

const EditExamModal = ({ exam, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (exam) {
      // Convert Vietnamese date format (DD/MM/YYYY) to YYYY-MM-DD for input
      const convertDate = (dateStr) => {
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      };

      setFormData({
        name: exam.name,
        startDate: convertDate(exam.startDate),
        endDate: convertDate(exam.endDate),
        description: exam.description || ''
      });
    }
  }, [exam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên kỳ thi';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        ...exam,
        ...formData
      });
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === 'edit-exam-modal-overlay') {
      onClose();
    }
  };

  return (
    <div className="edit-exam-modal-overlay" onClick={handleOverlayClick}>
      <div className="edit-exam-modal-main" onClick={(e)=> e.stopPropagation()}>
        <div className="edit-exam-modal-header">
          <h2 className="edit-exam-modal-title">Chỉnh sửa kỳ thi</h2>
          <button className="edit-exam-modal-close-button" onClick={onClose}>
            <IoIosClose className='edit-exam-modal-close-icon' />
          </button>
        </div>

        <div className="edit-exam-modal-form">
          <div className="edit-exam-modal-form-group">
            <label htmlFor="name">
              Tên kỳ thi <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'edit-exam-modal-error' : ''}
              placeholder="Nhập tên kỳ thi"
            />
            {errors.name && <span className="edit-exam-modal-error-message">{errors.name}</span>}
          </div>

          <div className="edit-exam-modal-form-row">
            <div className="edit-exam-modal-form-group">
              <label htmlFor="startDate">
                Ngày bắt đầu <span className="required">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={errors.startDate ? 'edit-exam-modal-error' : ''}
              />
              {errors.startDate && <span className="edit-exam-modal-error-message">{errors.startDate}</span>}
            </div>

            <div className="edit-exam-modal-form-group">
              <label htmlFor="endDate">
                Ngày kết thúc <span className="required">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={errors.endDate ? 'edit-exam-modal-error' : ''}
              />
              {errors.endDate && <span className="edit-exam-modal-error-message">{errors.endDate}</span>}
            </div>
          </div>

          <div className="edit-exam-modal-form-group">
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Nhập mô tả cho kỳ thi (tùy chọn)"
            />
          </div>

          <div className="edit-exam-modal-modal-actions">
            <button type="edit-exam-modal-button" className="edit-exam-modal-btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="edit-exam-modal-button" className="edit-exam-modal-btn-submit" onClick={handleSubmit}>
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditExamModal;