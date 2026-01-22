import './Style-SubjectTable.css';
import { FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import React, { useState } from 'react';

// props:
// - showView: boolean (default true) to control rendering of the View button
// - instructorLabel: string to label the instructor column (default 'Giảng viên')
// - instructorKey: string key in subject objects to display in that column (default 'instructor')
const SubjectTable = ({ subjects, onView, onEdit, onDelete, showView = true, instructorLabel = 'Giảng viên', instructorKey = 'instructor' }) => {
  const [selectedSubject, setSelectedSubject] = useState(null);

  const handleViewClick = (subject) => {
    setSelectedSubject(subject);
    onView(subject);
  };

  const handleEditClick = (subject) => {
    setSelectedSubject(subject);
    onEdit(subject);
  };

  return (
    <div className="subject-table-container">
      <div className="subject-table-wrapper">
        <table className="subject-table">
          <thead>
            <tr className="subject-table-header-row">
              <th className="subject-table-header ">STT</th>
              <th className="subject-table-header">Mã môn</th>
              <th className="subject-table-header subject-table-row-left">Tên môn học</th>
              <th className="subject-table-header">Số tín chỉ</th>
              <th className="subject-table-header">{instructorLabel}</th>
              <th className="subject-table-header table-header-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, index) => (
              <tr key={subject.id} className="subject-table-row">
                <td className="subject-table-cell">{index + 1}</td>
                <td className="subject-table-cell subject-table-cell-code">{subject.subjectCode || subject.code}</td>
                <td className="subject-table-cell subject-table-row-left">{subject.name}</td>
                <td className="subject-table-cell">{subject.creditHour || subject.credits}</td>
                <td className="subject-table-cell">{subject[instructorKey]}</td>
                <td className="subject-table-cell">
                  <div className="buttons">
                    {showView && (
                      <button
                        onClick={() => handleViewClick(subject)}
                        className="action-btn action-btn-view"
                        title="Xem"
                      >
                        <FaEye className="action-icon" />
                      </button>
                    )}
                    <button
                      onClick={() => handleEditClick(subject)}
                      className="action-btn action-btn-edit"
                      title="Sửa"
                    >
                      <MdEdit className="action-icon" />
                    </button>
                    <button
                      onClick={() => onDelete(subject)}
                      className="action-btn action-btn-delete"
                      title="Xóa"
                    >
                      <FaTrashAlt className="action-icon" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubjectTable;
