import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import TeacherSidebar from "../components/TeacherSidebar";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [lectures, setLectures] = useState([]);
  const [teacherName, setTeacherName] = useState("Teacher");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api("/api/teacher/timetable");
        setLectures(data);

        if (data.length > 0) {
          setTeacherName(data[0].teacher_name);
        }
      } catch (err) {
        console.error(err);
        setError("Error loading lectures. Please refresh the page and try again.");
      }
    };

    load();
  }, []);

  const classes = new Set(lectures.map((l) => `${l.class_name} ${l.section}`));
  const subjects = new Set(lectures.map((l) => l.subject));

  return (
    <div className="teacher-page">
      <TeacherSidebar />

      <div className="main">
        <div className="header">
          <h1>Welcome, <span>{teacherName}</span> 👋</h1>
          <p>Here you can view your scheduled lectures and take attendance.</p>
        </div>

        <div className="teacher-cards">
          <div className="card"><h3>Total Lectures</h3><div className="number">{lectures.length}</div></div>
          <div className="card"><h3>Classes</h3><div className="number">{classes.size}</div></div>
          <div className="card"><h3>Subjects</h3><div className="number">{subjects.size}</div></div>
        </div>

        <div className="section">
          <h2>My Scheduled Lectures</h2>

          {error ? (
            <div className="empty"><h3>Error loading lectures</h3><p>{error}</p></div>
          ) : lectures.length === 0 ? (
            <div className="empty">
              <h3>No lectures scheduled</h3>
              <p>Admin has not assigned any lectures to you yet.</p>
            </div>
          ) : (
            lectures.map((lecture) => (
              <div className="teacher-lecture" key={lecture._id}>
                <div className="teacher-lecture-info">
                  <h3>{lecture.subject}</h3>
                  <p><strong>Class:</strong> {lecture.class_name} - {lecture.section}</p>
                  <p><strong>Day:</strong> {lecture.day}</p>
                  <p className="lecture-time">{lecture.start_time} - {lecture.end_time}</p>
                </div>
                <button className="attendance-btn" onClick={() => navigate(`/attendance/${lecture._id}`)}>
                  Take Attendance
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
