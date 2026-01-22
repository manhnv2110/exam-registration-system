import { IoIosSearch } from "react-icons/io";
import { TfiImport } from "react-icons/tfi";
import { IoMdAdd } from "react-icons/io";
import './Style-StudentSearchBar.css';
import AddStudentModal from '../addStudentModal/AddStudentModal'
import ImportStudentModal from "../importStudentModal/ImportStudentModal";
import { useState } from "react";

const StudentSearchBar = ({ onSearch, onImportSuccess, onAdd }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const handleAddStudentClick = () => {
    setShowAddModal(true);
  };

  const handleImportClick = () => {
    setShowImportModal(true);
  };

  return (
    <>
      <div className="student-searchbar-container">
        <div className="search-student-input-wrapper">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã sinh viên"
            onChange={(e) => onSearch(e.target.value)}
            className="search-student-input"
          />
          <button className="search-student-btn">
            <IoIosSearch className="search-student-icon" />
          </button>
        </div>

        <div className="search-bar-student-buttons">
          <button onClick={handleImportClick} className="btn-import">
            <TfiImport className="btn-icon-student" />
            <span>Import Excel</span>
          </button>

          <button onClick={handleAddStudentClick} className="btn-add-student">
            <IoMdAdd className="btn-icon-student" />
            <span>Thêm sinh viên</span>
          </button>
        </div>
      </div>

      {showAddModal && (
        <AddStudentModal
          onClose={() => setShowAddModal(false)}
          onSubmit={onAdd}
        />
      )}

      {showImportModal && (
        <ImportStudentModal
            onClose={() => setShowImportModal(false)}
            onImportSuccess={() => {
                setShowImportModal(false);
                onImportSuccess && onImportSuccess();
            }}
        />
      )}
    </>
  )
};

export default StudentSearchBar;
