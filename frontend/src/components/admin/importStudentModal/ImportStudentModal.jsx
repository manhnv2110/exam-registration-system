import './Style-ImportStudentModal.css';
import React, { useState } from 'react';
import { IoCloudUploadSharp } from "react-icons/io5";
import { FaFileAlt } from "react-icons/fa";
import { CiImport } from "react-icons/ci";
import * as XLSX from 'xlsx';
import { useImportLog } from '../../../hooks/useImportLog';

const ImportStudentModal = ({ onClose, onImportSuccess }) => {

  const { importStudentAccounts } = useImportLog()
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    if (!validTypes.includes(selectedFile.type)) {
      setError('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
      return;
    }

    setFile(selectedFile);
    setError('');
    
    // // Read and preview file
    readExcelFile(selectedFile);
  };

  const readExcelFile = (file) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        // Skip header row and map to student objects
        const students = jsonData.slice(1)
          .filter(row => row.length > 0 && row[0]) // Filter empty rows
          .map((row, index) => ({
            rowNumber: index + 2,
            studentCode: row[1]?.toString().trim() || '',
            fullname: row[2]?.toString().trim() || '',
            email: row[3]?.toString().trim() || '',
            className: row[4]?.toString().trim() || '',
            major: row[5]?.toString().trim() || '',
            faculty: row[6]?.toString().trim() || '',
            gender: row[7]?.toString().trim() || '',
            dob: row[8] ? formatExcelDate(row[8]) : '',
            phone: row[9]?.toString().trim() || '',
          }));
        
        setPreview(students);
        setShowPreview(true);
      } catch (err) {
        console.error('Error reading file:', err);
        setError('Không thể đọc file Excel. Vui lòng kiểm tra định dạng file.');
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  const formatExcelDate = (excelDate) => {
    // If already a string (DD/MM/YYYY), keep it
    if (typeof excelDate === 'string') {
      return excelDate;
    }
    
    // If Excel serial date number
    if (typeof excelDate === 'number') {
      const date = new Date((excelDate - 25569) * 86400 * 1000);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    
    return '';
  };

  const handleImport = async () => {
    if (!file || preview.length === 0) {
      setError('Vui lòng chọn file Excel có dữ liệu hợp lệ');
      return;
    }

    setLoading(true);
    try {
      await importStudentAccounts(file);
      if (onImportSuccess) onImportSuccess();
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  };

  // const downloadTemplate = () => {
  //   // Create template data
  //   const template = [
  //     ['Mã SV', 'Họ và tên', 'Giới tính', 'Lớp', 'Ngành', 'Khoa', 'Số điện thoại', 'Email', 'Ngày sinh'],
  //     ['SV001', 'Nguyễn Văn A', 'Nam', 'CNTT01', 'Công nghệ thông tin', 'Khoa CNTT', '0912345678', 'nguyenvana@example.com', '15/05/2002'],
  //     ['SV002', 'Trần Thị B', 'Nữ', 'CNTT01', 'Công nghệ thông tin', 'Khoa CNTT', '0923456789', 'tranthib@example.com', '20/08/2002'],
  //     ['SV003', 'Lê Văn C', 'Nam', 'CNTT02', 'Hệ thống thông tin', 'Khoa CNTT', '0934567890', 'levanc@example.com', '12/03/2002']
  //   ];

  //   // Create workbook
  //   const wb = XLSX.utils.book_new();
  //   const ws = XLSX.utils.aoa_to_sheet(template);

  //   // Set column widths
  //   ws['!cols'] = [
  //     { wch: 12 }, // Mã SV
  //     { wch: 25 }, // Họ và tên
  //     { wch: 10 }, // Giới tính
  //     { wch: 12 }, // Lớp
  //     { wch: 25 }, // Ngành
  //     { wch: 20 }, // Khoa
  //     { wch: 15 }, // SĐT
  //     { wch: 30 }, // Email
  //     { wch: 12 }  // Ngày sinh
  //   ];

  //   XLSX.utils.book_append_sheet(wb, ws, 'Sinh viên');

  //   // Download
  //   XLSX.writeFile(wb, 'template_import_sinh_vien.xlsx');
  // };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      // Create a fake event object for handleFileChange
      const fakeEvent = {
        target: {
          files: [droppedFile]
        }
      };
      handleFileChange(fakeEvent);
    }
  };

  return (
    <div className="import-student-modal-overlay" onClick={onClose}>
      <div className="import-student-modal-main" onClick={(e) => e.stopPropagation()}>
        <div className="import-student-modal-header">
          <h2 className="import-student-modal-title">Import danh sách sinh viên</h2>
        </div>

        <div className="import-student-modal-body">
          {/* File Upload */}
          <div className="file-upload-student-section">
            <label 
              className="file-upload-student-label"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="file-student-input"
                disabled={loading}
              />
              <div className={`file-student-upload-box ${file ? 'has-file' : ''}`}>
                {file ? (
                  <>
                    <span className="file-student-icon"><FaFileAlt/></span>
                    <span className="file-student-name">{file.name}</span>
                    <span className="file-student-size">({(file.size / 1024).toFixed(2)} KB)</span>
                  </>
                ) : (
                  <>
                    <span className="upload-student-icon"><IoCloudUploadSharp/></span>
                    <span className="upload-student-text">Chọn file Excel hoặc kéo thả vào đây</span>
                    <span className="upload-student-hint">Hỗ trợ .xlsx, .xls</span>
                  </>
                )}
              </div>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {/* Preview */}
          {showPreview && preview.length > 0 && (
            <div className="preview-student-section">
              <div className="preview-student-header">
                <h3>Kiểm tra dữ liệu</h3>
                <span className="preview-student-count">{preview.length} sinh viên</span>
              </div>
              <div className="preview-student-table-container">
                <table className="preview-student-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Mã SV</th>
                      <th>Họ tên</th>
                      <th>Giới tính</th>
                      <th>Lớp</th>
                      <th>Ngành</th>
                      <th>Khoa</th>
                      <th>Email</th>
                      <th>SĐT</th>
                      <th>Ngày sinh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((student, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td><strong>{student.studentCode}</strong></td>
                        <td>{student.fullname}</td>
                        <td>{student.gender}</td>
                        <td>{student.className}</td>
                        <td>{student.major}</td>
                        <td>{student.faculty}</td>
                        <td>{student.email}</td>
                        <td>{student.phone}</td>
                        <td>{student.dob}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="import-student-modal-footer">
          <button onClick={onClose} className="btn-cancel" disabled={loading}>
            Hủy
          </button>
          <button 
            onClick={handleImport} 
            className="btn-import" 
            disabled={loading || !file || preview.length === 0}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Đang import...
              </>
            ) : (
              <>
                Import {preview.length > 0 ? `${preview.length} sinh viên` : ''}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportStudentModal;