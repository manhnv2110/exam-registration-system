import './Style-AddExamSessionModal.css';
import React, { useState, useEffect } from 'react';
import { roomLocationService } from '../../../services/roomLocationService';
import { examSessionService } from '../../../services/examSessionService';

const AddExamSessionModal = ({ onClose, onSave, subjectInfo }) => {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    room: '',
    location: '',
    capacity: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Danh sách phòng thi có sẵn
  const [availableRooms,setAvailableRooms] = useState([]);

  // Danh sách địa điểm thi
  const [availableLocations, setAvailableLocations] = useState([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (formData.location) {
      fetchRoomsByLocation(formData.location);
    } else {
      setAvailableRooms([]);
      setFormData(prev => ({ ...prev, room: '' }));
    }
  }, [formData.location]);

  const fetchLocations = async () => {
    try {
      const data = await roomLocationService.getAllLocations();
      setAvailableLocations(data);
    } catch (err) {
      console.error('Error loading locations:', err);
      setError('Không thể tải danh sách địa điểm. Vui lòng thử lại!');
    }
  };

  const fetchRoomsByLocation = async (locationId) => {
    try {
      const response = await roomLocationService.getRoomsByLocationId(locationId);
      setAvailableRooms(response);
    } catch (err) {
      console.error('Error loading rooms:', err);
      setError('Không thể tải danh sách phòng. Vui lòng thử lại!');
      setAvailableRooms([]);
    }
  };
  

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.date) {
      setError('Vui lòng chọn ngày thi!');
      return false;
    }
    if (!formData.startTime) {
      setError('Vui lòng nhập giờ bắt đầu!');
      return false;
    }
    if (!formData.room) {
      setError('Vui lòng chọn phòng thi!');
      return false;
    }
    if (!formData.location) {
      setError('Vui lòng chọn địa điểm thi!');
      return false;
    }
    if (!formData.capacity || formData.capacity <= 0) {
      setError('Vui lòng nhập sức chứa hợp lệ!');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API call
    try {
      // Prepare data for API
      const sessionData = {
        date: formData.date,
        startTime: formData.startTime,
        roomId: parseInt(formData.room),
        subjectId: parseInt(subjectInfo.subjectId),
        examId: parseInt(subjectInfo.examId),
        capacity: parseInt(formData.capacity)
      };

      // Call API to create exam session
      await examSessionService.createExamSession(sessionData);
      
      // Success callback
      onSave(sessionData);
      alert('Tạo ca thi thành công!');
      onClose();
    } catch (err) {
      console.error('Error creating exam session:', err);
      setError(err.message || 'Có lỗi xảy ra khi tạo ca thi!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-exam-session-modal-overlay" onClick={onClose}>
      <div className="add-exam-session-modal-main" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="add-exam-session-modal-header">
          <div>
            <h2 className="add-exam-session-modal-title">Tạo ca thi mới</h2>
          </div>
          <button className="add-exam-session-modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="add-exam-session-modal-body">
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <form className="add-exam-session-form">
            {/* Row 1: Tên môn thi & Sức chứa phòng thi */}
            <div className="add-exam-session-form-row">
              

                <div className="add-exam-session-form-group">
                    <label className="add-exam-session-form-label">
                    Tên môn thi
                    </label>
                    <input
                    type="text"
                    className="add-exam-session-form-input"
                    value={subjectInfo.subjectName}
                    readOnly
                    disabled
                    />
                </div>
                <div className="form-group">
                    <label className="add-exam-session-form-label">
                        Sức chứa phòng thi <span className="required">*</span>
                    </label>
                    <input
                        type="number"
                        className="add-exam-session-form-input"
                        value={formData.capacity}
                        onChange={(e) => handleChange('capacity', e.target.value)}
                        placeholder="Số sinh viên tối đa"
                        min="1"
                        disabled={loading}
                    />
                </div>
            </div>
            <div className='add-exam-session-form-row'>
                <div className="add-exam-session-form-group">
                    <label className="add-exam-session-form-label">
                    Ngày thi <span className="required">*</span>
                    </label>
                    <input
                    type="date"
                    className="add-exam-session-form-input"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    disabled={loading}
                    />
                </div>
                <div className="add-exam-session-form-group">
                    <label className="add-exam-session-form-label">
                    Giờ bắt đầu <span className="required">*</span>
                    </label>
                    <input
                    type="text"
                    className="add-exam-session-form-input"
                    value={formData.startTime}
                    onChange={(e) => handleChange('startTime', e.target.value)}
                    placeholder="Định dạng: HH:MM"
                    disabled={loading}
                    />
                </div>
            </div>
            <div className="add-exam-session-form-row">
                <div className="add-exam-session-form-group">
                    <label className="add-exam-session-form-label">
                    Địa điểm thi <span className="required">*</span>
                    </label>
                    <select
                    className="add-exam-session-form-input add-exam-session-form-select"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    disabled={loading}
                    >
                    <option value="">Chọn địa điểm</option>
                    {availableLocations.map(location => (
                        <option key={location.id} value={location.id}>{location.name}</option>
                    ))}
                    </select>
                </div>
                
                <div className="add-exam-session-form-group">
                    <label className="add-exam-session-form-label">
                    Phòng thi <span className="required">*</span>
                    </label>
                    <select
                    className="add-exam-session-form-input add-exam-session-form-select"
                    value={formData.room}
                    onChange={(e) => handleChange('room', e.target.value)}
                    disabled={loading}
                    >
                    <option value="">Chọn phòng thi</option>
                    {availableRooms.map(room => (
                        <option key={room.id} value={room.id}>{room.name}</option>
                    ))}
                    </select>
                </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="add-exam-session-modal-footer">
          <button onClick={onClose} className="btn-cancel" disabled={loading}>
            Hủy
          </button>
          <button onClick={handleSubmit} className="btn-create" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Đang tạo...
              </>
            ) : (
              <>
                Tạo ca thi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExamSessionModal;