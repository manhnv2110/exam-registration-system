import { useState, useEffect } from "react";
import Header from "../../../components/admin/header/Header";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import apiCall from "../../../utils/api";
import './Style-Report.css'

const Report = () => {
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState('');
    const [stats, setStats] = useState({
        totalStudents: 0,
        eligibleStudents: 0,
        ineligibleStudents: 0,
        finishedRegistrationCount: 0,
        totalSubjects: 0,
        totalExamSessions: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchExams();
    }, []);

    useEffect(() => {
        if (selectedExam) {
            fetchReportStats(selectedExam);
        }
    }, [selectedExam]);

    const fetchExams = async () => {
        try {
            setLoading(true);
            const response = await apiCall('/exams', { method: 'GET' }, true);
            console.log('Exams response:', response);
            if (response.data && response.data.length > 0) {
                setExams(response.data);
                setSelectedExam(response.data[0].id);
            }
        } catch (err) {
            setError('Failed to fetch exams: ' + (err.message || 'Unknown error'));
            console.error('Error fetching exams:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchReportStats = async (examId) => {
        try {
            setLoading(true);
            const response = await apiCall(`/reports/exam/${examId}`, { method: 'GET' }, true);
            console.log('Report stats response:', response);
            if (response.data) {
                setStats({
                    totalStudents: response.data.totalStudents || 0,
                    eligibleStudents: response.data.eligibleStudents || 0,
                    ineligibleStudents: response.data.ineligibleStudents || 0,
                    finishedRegistrationCount: response.data.finishedRegistrationCount || 0,
                    totalSubjects: response.data.totalSubjects || 0,
                    totalExamSessions: response.data.totalExamSessions || 0
                });
            }
        } catch (err) {
            setError('Failed to fetch report stats: ' + (err.message || 'Unknown error'));
            console.error('Error fetching report stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const finishedChartData = [
        { name: 'Hoàn thành đăng ký', value: stats.finishedRegistrationCount },
        { name: 'Chưa hoàn thành', value: Math.max(stats.eligibleStudents - stats.finishedRegistrationCount, 0) }
    ];

    const COLORS = ['#4CAF50', '#f44336'];

    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

        return (
            <text 
                x={x} 
                y={y} 
                fill="white" 
                textAnchor={x > cx ? 'start' : 'end'} 
                dominantBaseline="central"
                fontSize="14"
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    if (loading && exams.length === 0) {
        return (
            <div className="page">
                <Header/>
                <div className="main">
                    <Sidebar/>
                    <div className="content">
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && exams.length === 0) {
        return (
            <div className="page">
                <Header/>
                <div className="main">
                    <Sidebar/>
                    <div className="content">
                        <p style={{color: 'red'}}>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <Header/>
            <div className="main">
                <Sidebar/>
                <div className="content">
                    <h1 className="page-title">Báo cáo tổng hợp</h1>

                    <div className="card">
                        <div className="form-row">
                            <label className="label">Chọn kỳ thi</label>
                            <select 
                                className="subject-select" 
                                value={selectedExam} 
                                onChange={e => setSelectedExam(e.target.value)}
                            >
                                {exams.map(e => (
                                    <option key={e.id} value={e.id}>{e.examName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="report-stats">
                            <div className="stat-card">
                                <div className="stat-value">{stats.totalSubjects}</div>
                                <div className="stat-label">Tổng số môn học</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">{stats.totalExamSessions}</div>
                                <div className="stat-label">Tổng số ca thi</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">{stats.totalStudents}</div>
                                <div className="stat-label">Tổng số sinh viên</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">
                                    {stats.eligibleStudents > 0 ? ((stats.finishedRegistrationCount / stats.eligibleStudents) * 100).toFixed(1) : 0}%
                                </div>
                                <div className="stat-label">Tỷ lệ sinh viên đã hoàn thành đăng ký</div>
                            </div>
                        </div>

                        <div className="chart-container">
                            <h3 className="chart-title">Tỷ lệ sinh viên đã hoàn thành đăng ký</h3>
                            <ResponsiveContainer width="100%" height={350}>
                                <PieChart>
                                    <Pie
                                        data={finishedChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomLabel}
                                        outerRadius={120}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {finishedChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Report;
