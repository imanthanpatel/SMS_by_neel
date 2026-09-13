import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";

export default function Attendance() {
  const { lectureId } = useParams();
  const [lecture, setLecture] = useState(null);
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await api(`/api/attendance/${lectureId}/students`);
        setLecture(data.lecture);
        setStudents((data.students || []).map((student) => ({
          ...student,
          status: "Present"
        })));

        if (data.attendance_exists) {
          setMessage({
            text: "Attendance has already been submitted for this lecture today.",
            type: "warning"
          });
          setSubmitted(true);
        }
      } catch (error) {
        setMessage({ text: error.message || "Unable to load students", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [lectureId]);

  const setAttendance = (index, status) => {
    setStudents((current) =>
      current.map((student, i) =>
        i === index ? { ...student, status } : student
      )
    );
  };

  const presentCount = students.filter((student) => student.status === "Present").length;
  const absentCount = students.filter((student) => student.status === "Absent").length;

  const submitAttendance = async () => {
    if (students.length === 0) {
      setMessage({ text: "There are no students to mark attendance.", type: "error" });
      return;
    }

    if (!window.confirm("Are you sure you want to submit attendance?")) return;

    setSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      await api("/api/attendance", {
        method: "POST",
        body: JSON.stringify({
          lecture_id: lectureId,
          date: today,
          attendance: students.map((student) => ({
            student_id: student.student_id,
            status: student.status
          }))
        })
      });

      setMessage({ text: "Attendance submitted successfully!", type: "success" });
      setSubmitted(true);
      window.alert("Attendance submitted successfully!");
    } catch (error) {
      setMessage({ text: error.message || "Failed to submit attendance", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="attendance-page">
      <div className="main">
        <Link to="/dashboard/teacher" className="back-btn">← Back to Dashboard</Link>

        <div className="header">
          <h1>Take Attendance</h1>
          <p><strong>Subject:</strong> <span>{lecture?.subject || "Loading..."}</span></p>
          <p><strong>Class:</strong> <span>{lecture ? `${lecture.class_name} - ${lecture.section}` : "Loading..."}</span></p>
          <p><strong>Time:</strong> <span>{lecture ? `${lecture.start_time} - ${lecture.end_time}` : "Loading..."}</span></p>
          <p><strong>Date:</strong> <span>{today}</span></p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <div className="attendance-box">
          <h2>Student Attendance</h2>

          <div className="summary">
            <div className="summary-card">Total:<strong>{students.length}</strong></div>
            <div className="summary-card">Present:<strong>{presentCount}</strong></div>
            <div className="summary-card">Absent:<strong>{absentCount}</strong></div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Attendance</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="attendance-loading">Loading students...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan="4" className="attendance-loading">No students found for this class.</td></tr>
                ) : (
                  students.map((student, index) => (
                    <tr key={student.student_id || student._id}>
                      <td>{index + 1}</td>
                      <td>{student.student_id}</td>
                      <td>{student.name}</td>
                      <td>
                        <div className="status-buttons">
                          <button
                            disabled={submitted}
                            className={`status-btn present ${student.status === "Present" ? "active" : ""}`}
                            onClick={() => setAttendance(index, "Present")}
                          >
                            Present
                          </button>
                          <button
                            disabled={submitted}
                            className={`status-btn absent ${student.status === "Absent" ? "active" : ""}`}
                            onClick={() => setAttendance(index, "Absent")}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <button
            className="submit-btn"
            disabled={submitting || submitted}
            onClick={submitAttendance}
          >
            {submitted ? "Attendance Submitted" : submitting ? "Submitting..." : "Submit Attendance"}
          </button>
        </div>
      </div>
    </div>
  );
}
