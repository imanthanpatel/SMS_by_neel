import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import AdminDashboard from "./pages/AdminDashboard";
import Students from "./pages/Students";
import Timetable from "./pages/Timetable";
import TeacherDashboard from "./pages/TeacherDashboard";
import Attendance from "./pages/Attendance";
import AttendanceHistory from "./pages/AttendanceHistory";
import StudentDashboard from "./pages/StudentDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard/admin"
        element={<AdminDashboard />}
      />

      <Route
        path="/students"
        element={<Students />}
      />

      <Route
        path="/timetable"
        element={<Timetable />}
      />

      <Route
        path="/dashboard/teacher"
        element={<TeacherDashboard />}
      />

      <Route
        path="/attendance/:lectureId"
        element={<Attendance />}
      />

      <Route
        path="/attendance-history"
        element={<AttendanceHistory />}
      />

      <Route
        path="/dashboard/student"
        element={<StudentDashboard />}
      />

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      <Route
        path="*"
        element={<Unauthorized />}
      />
    </Routes>
  );
}