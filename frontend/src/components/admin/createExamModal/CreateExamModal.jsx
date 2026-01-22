import './Style-CreateExamModal.css';
import { IoIosClose } from "react-icons/io";
import { useState } from 'react';
import { MdCalendarToday } from "react-icons/md";

const CreateExamModal = ({onClose, onSubmit}) => {
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        description: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (new Date(formData.startDate) > new Date(formData.endDate)) {
            alert('Ngày kết thúc phải sau ngày bắt đầu!');
            return;
        }

        onSubmit(formData);
        handleCloseModal();
    }

    const handleCloseModal = () => {
        setFormData ({
            name: '',
            startDate: '',
            endDate: '',
            description: ''
        });
        onClose();
    };

    return (
        <div className='create-exam-modal-overlay' onClick={handleCloseModal}>
            <div className='create-exam-modal-main' onClick={(e)=> e.stopPropagation()}>
                <div className='create-exam-modal-header'>
                    <h2 className='create-exam-modal-title'>Tạo kỳ thi mới</h2>
                    <button className='create-exam-modal-close-btn' onClick={handleCloseModal}>
                        <IoIosClose className='create-exam-modal-close-icon'/>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className='create-exam-modal-form'>
                    <div className='create-exam-form-group'>
                        <label className='create-exam-form-label'>
                            Tên kì thi <span className='required'>*</span>
                        </label>
                        <input type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className='create-exam-form-input'
                        placeholder='VD: Kỳ thi giữa học kỳ 1 năm học 2024-2025'
                        required/>
                    </div>
                    <div className='create-exam-form-row'>
                        <div className='create-exam-form-group'>
                            <label className='create-exam-form-label'>
                                Ngày bắt đầu <span className='required'>*</span>
                            </label>
                            <input type="date"
                                name='startDate'
                                value={formData.startDate}
                                onChange={handleInputChange}
                                className='create-exam-form-input'
                                required
                            />
                        </div>
                        <div className='create-exam-form-group'>
                            <label className='create-exam-form-label'>
                                Ngày kết thúc <span className='required'>*</span>
                            </label>
                            <input type="date" 
                                name='endDate'
                                value={formData.endDate}
                                onChange={handleInputChange}
                                className='create-exam-form-input'
                                required/>
                        </div>
                    </div>
                    <div className='create-exam-form-group'>
                        <label className='create-exam-form-label'>Mô tả</label>
                        <textarea name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className='create-exam-form-textarea'
                        placeholder='Nhập mô tả về kỳ thi (tùy chọn)'
                        rows="4"></textarea>
                    </div>
                    <div className='create-exam-modal-footer'>
                        <button className='create-exam-modal-btn-cancel' onClick={handleCloseModal}>Hủy</button>
                        <button className='create-exam-modal-btn-submit' type='submit'>Tạo kỳ thi</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default CreateExamModal;