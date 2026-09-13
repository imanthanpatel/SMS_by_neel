import { useEffect, useState } from "react";
import TeacherSidebar from "../components/TeacherSidebar";
import api from "../api";

export default function AttendanceHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, loading: false, record: null, error: "" });

  useEffect(() => {
    const load = async () => {
      try {
        setRecords(await api("/api/teacher/attendance-history"));
      } catch (error) {
        console.error(error);
        setRecords(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const viewDetails = async (attendanceId) => {
    setModal({ open: true, loading: true, record: null, error: "" });

    try {
      const record = await api(`/api/teacher/attendance-history/${attendanceId}`);
      setModal({ open: true, loading: false, record, error: "" });
    } catch (error) {
      setModal({ open: true, loading: false, record: null, error: "Please try again." });
    }
  };

  return (
    <div className="attendance-history-page">
      <TeacherSidebar />

      <div className="main">
        <div className="header">
          <h1>Attendance History</h1>
          <p>View previously submitted attendance records.</p>
        </div>

        <div className="section">
          <h2>My Attendance Records</h2>

          <div>
            {loading ? (
              <div className="empty"><h3>Loading attendance...</h3><p>Please wait.</p></div>
            ) : records === null ? (
              <div className="empty"><h3>Error Loading Attendance</h3><p>Please refresh the page and try again.</p></div>
            ) : records.length === 0 ? (
              <div className="empty"><h3>No Attendance Records</h3><p>You have not submitted any attendance yet.</p></div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      {["Subject","Class","Date","Time","Total","Present","Absent","Action"].map((heading) => (
                        <th key={heading}>{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record._id}>
                        <td><strong>{record.subject}</strong></td>
                        <td>{record.class_name} - {record.section}</td>
                        <td>{record.date}</td>
                        <td>{record.start_time} - {record.end_time}</td>
                        <td>{record.total_students}</td>
                        <td><span className="present">{record.present}</span></td>
                        <td><span className="absent">{record.absent}</span></td>
                        <td>
                          <button className="view-btn" onClick={() => viewDetails(record._id)}>
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {modal.open && (
        <div className="history-modal" onClick={(e) => e.target === e.currentTarget && setModal((m) => ({ ...m, open: false }))}>
          <div className="history-modal-content">
            <button className="close-btn" onClick={() => setModal((m) => ({ ...m, open: false }))}>×</button>

            {modal.loading ? (
              <div className="empty"><h3>Loading...</h3></div>
            ) : modal.error ? (
              <div className="empty"><h3>Unable to Load Details</h3><p>{modal.error}</p></div>
            ) : modal.record ? (
              <>
                <div className="modal-title">
                  <h2>{modal.record.subject}</h2>
                  <p>Attendance Details</p>
                </div>

                <div className="lecture-details">
                  <p><strong>Class:</strong> {modal.record.class_name} - {modal.record.section}</p>
                  <p><strong>Date:</strong> {modal.record.date}</p>
                  <p><strong>Time:</strong> {modal.record.start_time} - {modal.record.end_time}</p>
                  <p><strong>Teacher:</strong> {modal.record.teacher_name}</p>
                </div>

                <div className="table-container">
                  <table className="students-table">
                    <thead>
                      <tr><th>#</th><th>Student ID</th><th>Student Name</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {(modal.record.students || []).map((student, index) => (
                        <tr key={student.student_id || index}>
                          <td>{index + 1}</td>
                          <td>{student.student_id}</td>
                          <td>{student.student_name}</td>
                          <td>
                            <span className={student.status === "Present" ? "present" : "absent"}>
                              {student.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
