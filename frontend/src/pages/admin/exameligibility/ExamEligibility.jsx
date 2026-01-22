import { useEffect, useRef, useState } from "react";
import Header from "../../../components/admin/header/Header";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import './Style-ExamEligibility.css'
import { examService } from "../../../services/examService";
import { ExamResponse } from "../../../models/Exam";
import { Subject } from "../../../models/Subject";
import { useSubjectStatus } from "../../../hooks/useSubjectStatus";
import { importLogService } from "../../../services/importLogService";
import { IoMdCloudUpload, IoMdCheckmarkCircle } from "react-icons/io";
import Spinner from "../../../components/student/spinner/Spinner";


const ExamEligibility = () => {

  const {getStudentsCondition} = useSubjectStatus()

  const [exam, setExam] = useState(null);
  const [exams, setExams] = useState([])
  const [selectedExamId, setSelectedExamId] = useState('');
  const [subject, setSubject] = useState(null);
  const [subjects, setSubjects] = useState([])
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [students, setStudents] = useState([])
  const [file, setFile] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    const fetchData = async () => {
      try {
        const examData = await examService.getAll()
        const examResponses = examData.map(exam => ExamResponse.fromJSON(exam))
        setExams(examResponses)
        if (examResponses.length > 0) {
          setExam(examResponses[0])
          setSelectedExamId(String(examResponses[0].id))
        }
      } catch (error) {
        console.error("Load exam faild: ", error)
        throw error
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!exam) return 
      try {
        const subjectData = await examService.getSubjectsOfExam(exam.id)
        const subjectResponses = subjectData.map(sub => Subject.fromJSON(sub))
        setSubjects(subjectResponses)

        if (subjectResponses.length > 0) {
          setSubject(subjectResponses[0])
          setSelectedSubjectId(String(subjectResponses[0].id))
        } else {
          setSubject(null)
          setSelectedSubjectId('')
        }
      } catch (error) {
        console.error("Load subjects failed: ", error);
        throw error
      }
    }
    fetchSubjects()
  }, [exam])


  const fetchStudents = async () => {
    if (!exam || !subject) return;
    try {
      const conditions = await getStudentsCondition(subject.id, exam.id);
      setStudents(conditions);
    } catch (error) {
      console.error("Load students failed: ", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [exam, subject]);

  const handleImportCondition = async () => {
    if (!file) {
      alert("Vui lòng kéo thả file Excel trước")
      return 
    }
    if (!exam || !subject) {
      alert('Vui lòng chọn kỳ thi và môn học trước khi import')
      return;
    }
    try {
      setLoading(true)
      await importLogService.importStudentsCondition(exam.id, file)
      setLoading(false)
      alert('Import thành công')
      setFile(null)
      fetchStudents()
    } catch (error) {
      console.error('Import failed: ', error);
      alert(`Import thất bại: ${error.message}`)
    }
  }

  const validateAndSetFile = (incomingFile) => {
    if (!incomingFile) return;
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    const isAllowed = allowedTypes.includes(incomingFile.type) || /\.(xlsx|xls)$/i.test(incomingFile.name);
    if (!isAllowed) {
      alert('Chỉ hỗ trợ file Excel (.xlsx, .xls)');
      return;
    }
    setFile(incomingFile);
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  }

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  }

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer?.files?.[0];
    validateAndSetFile(droppedFile);
  }

  const handleFileInputChange = (e) => {
    const picked = e.target.files?.[0];
    validateAndSetFile(picked);
    // reset input value so the same file can be picked again if needed
    e.target.value = '';
  }

  return (
    <div className="page">
      <Header />
      <div className="main">
        <Sidebar />
        <div className="content">
          <h1 className="page-title">Quản lý điều kiện dự thi</h1>

          <div className="card">
            <div className="form-row">
              <label className="label">Chọn kỳ thi</label>
              <select
                className="subject-select"
                value={selectedExamId}
                onChange={e => {
                  const val = e.target.value;
                  setSelectedExamId(val);
                  const found = exams.find(ex => String(ex.id) === String(val));
                  setExam(found || null);
                }}
              >
                {exams.map(e => (
                  <option key={e.id} value={String(e.id)}>{e.examName}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label className="label">Chọn môn học</label>
              <select
                className="subject-select"
                value={selectedSubjectId}
                onChange={e => {
                  const val = e.target.value;
                  setSelectedSubjectId(val);
                  const found = subjects.find(s => String(s.id) === String(val));
                  setSubject(found || null);
                }}
              >
                {subjects.map(s => (
                  <option key={s.id} value={String(s.id)}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Removed manual file chooser; using drag-and-drop below */}

            <div
              className={`dropzone ${isDragOver ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <IoMdCloudUpload className="dropzone-icon" />
              <div className="dropzone-text">
                <strong>Chọn file Excel hoặc kéo thả vào đây</strong>
                <span>Hỗ trợ .xlsx, .xls</span>
              </div>
            </div>

            {file && (
              <div className="selected-file">
                <IoMdCheckmarkCircle className="selected-file-icon" />
                <strong>{file.name}</strong>
              </div>
            )}

            <div className="actions-row">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
              />
              <button
                className="btn btn-primary btn-lg d-flex align-items-center gap-2 custom-action"
                onClick={handleImportCondition}
                disabled={!file}
                title={!file ? 'Vui lòng kéo thả file Excel vào vùng bên dưới' : 'Nhấn để import'}
              >
                {
                  loading ? 
                    <Spinner/> : (
                      <>
                        <i className="fas fa-download"></i>
                        <span>Import Excel</span>
                      </>
                    )
                }
              </button>
            </div>

            <div className="table-wrap">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>MÃ SV</th>
                    <th>HỌ VÀ TÊN</th>
                    <th>TRẠNG THÁI</th>
                    <th>LÝ DO</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    students.map((s, idx) => (
                      <tr key={s.studentId}>
                        <td>{idx + 1}</td>
                        <td>{s.studentCode}</td>
                        <td>{s.fullname}</td>
                        <td>
                          <span className={`status ${s.status === 'ELIGIBLE' ? 'status-yes' : 'status-no'}`}>
                            {s.status === 'ELIGIBLE' ? 'Đủ điều kiện' : 'Không đủ điều kiện'}
                          </span>
                        </td>
                        <td>{s.reason || '-'}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ExamEligibility;
