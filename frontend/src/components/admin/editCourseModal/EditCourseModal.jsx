import '../createExamModal/Style-CreateExamModal.css';
import { IoIosClose } from "react-icons/io";
import { useState, useEffect } from 'react';

const EditCourseModal = ({ course, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    credits: '',
    duration: '',
    status: 'Active'
  });

  useEffect(() => {
    if (course) {
      setFormData({
        code: course.subjectCode || course.code || '',
        name: course.name || '',
        credits: course.creditHour || course.credits || '',
        duration: course.duration || '',
        status: course.status || 'Active'
      });
    }
  }, [course]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name || !formData.credits || !formData.duration) {
      alert('Tất cả các trường đều bắt buộc');
      return;
    }
    const updatedCourse = {
      ...formData,
      credits: Number(formData.credits),
      duration: Number(formData.duration)
    };
    onSubmit(updatedCourse);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    onClose();
  };

  return (
    <div className='create-exam-modal-overlay' onClick={handleCloseModal}>
      <div className='create-exam-modal-main' onClick={(e) => e.stopPropagation()}>
        <div className='create-exam-modal-header'>
          <h2 className='create-exam-modal-title'>Chỉnh sửa môn học</h2>
          <button className='create-exam-modal-close-btn' onClick={handleCloseModal}>
            <IoIosClose className='create-exam-modal-close-icon' />
          </button>
        </div>
        <form onSubmit={handleSubmit} className='create-exam-modal-form'>
          <div className='create-exam-form-row'>
            <div className='create-exam-form-group'>
              <label className='create-exam-form-label'>Mã môn <span className='required'>*</span></label>
              <input name='code' value={formData.code} onChange={handleInputChange} className='create-exam-form-input' required />
            </div>
            <div className='create-exam-form-group'>
              <label className='create-exam-form-label'>Tên môn <span className='required'>*</span></label>
              <input name='name' value={formData.name} onChange={handleInputChange} className='create-exam-form-input' required />
            </div>
          </div>

          <div className='create-exam-form-row'>
            <div className='create-exam-form-group'>
              <label className='create-exam-form-label'>Số tín chỉ</label>
              <input type='number' name='credits' value={formData.credits} onChange={handleInputChange} className='create-exam-form-input' required min='0' />
            </div>
            <div className='create-exam-form-group'>
              <label className='create-exam-form-label'>Thời lượng thi (phút)</label>
              <input type='number' name='duration' value={formData.duration} onChange={handleInputChange} className='create-exam-form-input' placeholder='e.g. 90' required min='1' />
            </div>
          </div>

          <div className='create-exam-modal-footer'>
            <button type='button' className='create-exam-modal-btn-cancel' onClick={handleCloseModal}>Hủy</button>
            <button className='create-exam-modal-btn-submit' type='submit'>Cập nhật</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourseModal;
