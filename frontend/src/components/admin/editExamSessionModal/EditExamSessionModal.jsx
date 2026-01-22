import './Style-EditExamSessionModal.css';
import React, { useState, useEffect } from 'react';
import { roomLocationService } from '../../../services/roomLocationService';
import { examSessionService } from '../../../services/examSessionService';

const EditExamSessionModal = ({ onClose, onSave, session }) => {
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [availableRooms,setAvailableRooms] = useState([]);

  const [availableLocations, setAvailableLocations] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    room: '',
    location: '',
    capacity: ''
  });

  const toISODate = (dateStr) => {
    // nếu đã là "2025-12-20"
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

    // nếu là "20/12/2025"
    const m = dateStr?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (m) {
      const [, dd, mm, yyyy] = m;
      return `${yyyy}-${mm}-${dd}`;
    }

    return ''; // fallback
  }

  useEffect(() => {
    if (!session) return;
    setFormData({
      date: toISODate(session.date || ''),
      startTime: session.time || '',
      room: session.roomId || '',
      location: session.locationId || '',
      capacity: session.capacity ?? ''
    });
  }, [session]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };
  
  const fetchLocations = async () => {
    try {
      const data = await roomLocationService.getAllLocations();
      setAvailableLocations(data);
    } catch (err) {
      console.error('Error loading locations:', err);
      setError('Không thể tải danh sách địa điểm. Vui lòng thử lại!');
    }
  };
  
  useEffect(() => {
    fetchLocations();
  }, []);

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

  useEffect(() => {
    if (formData.location) {
      fetchRoomsByLocation(formData.location);
    } else {
      setAvailableRooms([]);
    }
  }, [formData.location]);

  // Xử lý khi location thay đổi
  const handleLocationChange = (newLocationId) => {
    // Chỉ reset room nếu location thực sự thay đổi
    if (newLocationId !== formData.location) {
      setFormData(prev => ({
        ...prev,
        location: newLocationId,
        room: '' // Reset room khi đổi location
      }));
    }
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
          capacity: parseInt(formData.capacity)
        };
  
        // Call API to create exam session
        await examSessionService.updateExamSession(session.id, sessionData);
        
        // Success callback
        onSave(sessionData);
        alert('Chỉnh sửa ca thi thành công!');
        onClose();
      } catch (err) {
        console.error('Error creating exam session:', err);
        setError(err.message || 'Có lỗi xảy ra khi tạo ca thi!');
      } finally {
        setLoading(false);
      }
  };
  
  return (
    <div className="edit-exam-session-modal-overlay" onClick={onClose}>
      <div className="edit-exam-session-modal-main" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="edit-exam-session-modal-header">
          <div>
            <h2 className="edit-exam-session-modal-title">Chỉnh sửa ca thi</h2>
          </div>
          <button className="edit-exam-session-modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="edit-exam-session-modal-body">
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <form className="edit-exam-session-form">
            {/* Row 1: Tên môn thi & Sức chứa phòng thi */}
            <div className="edit-exam-session-form-row">
              

                <div className="edit-exam-session-form-group">
                    <label className="edit-exam-session-form-label">
                    Tên môn thi
                    </label>
                    <input
                    type="text"
                    className="edit-exam-session-form-input"
                    value={session.subject}
                    readOnly
                    disabled
                    />
                </div>
                <div className="form-group">
                    <label className="edit-exam-session-form-label">
                        Sức chứa phòng thi <span className="required">*</span>
                    </label>
                    <input
                        type="number"
                        className="edit-exam-session-form-input"
                        value={formData.capacity}
                        onChange={(e) => handleChange('capacity', e.target.value)}
                        placeholder="Số sinh viên tối đa"
                        min="1"
                        disabled={loading}
                    />
                </div>
            </div>
            <div className='edit-exam-session-form-row'>
                <div className="edit-exam-session-form-group">
                    <label className="edit-exam-session-form-label">
                    Ngày thi <span className="required">*</span>
                    </label>
                    <input
                    type="date"
                    className="edit-exam-session-form-input"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    disabled={loading}
                    />
                </div>
                <div className="edit-exam-session-form-group">
                    <label className="edit-exam-session-form-label">
                    Giờ bắt đầu <span className="required">*</span>
                    </label>
                    <input
                    type="text"
                    className="edit-exam-session-form-input"
                    value={formData.startTime}
                    onChange={(e) => handleChange('startTime', e.target.value)}
                    placeholder="Định dạng: HH:MM"
                    disabled={loading}
                    />
                </div>
            </div>
            <div className="edit-exam-session-form-row">
                <div className="edit-exam-session-form-group">
                    <label className="edit-exam-session-form-label">
                    Địa điểm thi <span className="required">*</span>
                    </label>
                    <select
                    className="edit-exam-session-form-input edit-exam-session-form-select"
                    value={formData.location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    disabled={loading}
                    >
                    <option value="">Chọn địa điểm</option>
                    {availableLocations.map(location => (
                        <option key={location.id} value={location.id}>{location.name}</option>
                    ))}
                    </select>
                </div>
                
                <div className="edit-exam-session-form-group">
                    <label className="edit-exam-session-form-label">
                    Phòng thi <span className="required">*</span>
                    </label>
                    <select
                    className="edit-exam-session-form-input edit-exam-session-form-select"
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
        <div className="edit-exam-session-modal-footer">
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
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditExamSessionModal;