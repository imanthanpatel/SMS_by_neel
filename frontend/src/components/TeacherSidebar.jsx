import { useState } from "react";
import { NavLink } from "react-router-dom";
import LogoutLink from "./LogoutLink";

export default function TeacherSidebar() {
  const [open, setOpen] = useState(false);
  const navClass = ({ isActive }) =>
    `block text-white no-underline px-4 py-3 mb-2 rounded-lg ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`;

  const content = (
    <>
      <h2>Teacher Panel</h2>
      <NavLink to="/dashboard/teacher" onClick={() => setOpen(false)} className={navClass}>Dashboard</NavLink>
      <a href="#" onClick={(e) => e.preventDefault()} className="block text-white no-underline px-4 py-3 mb-2 rounded-lg hover:bg-gray-700">My Lectures</a>
      <NavLink to="/attendance-history" onClick={() => setOpen(false)} className={navClass}>Attendance History</NavLink>
      <a href="#" onClick={(e) => e.preventDefault()} className="block text-white no-underline px-4 py-3 mb-2 rounded-lg hover:bg-gray-700">Students</a>
      <LogoutLink className="logout block text-white no-underline px-4 py-3 rounded-lg" />
    </>
  );

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed top-4 left-4 z-50 md:hidden bg-gray-800 text-white rounded-lg px-3 py-2 shadow-lg" aria-label="Open menu">☰</button>
      <aside className="teacher-sidebar hidden md:block">{content}</aside>
      {open && <div className="fixed inset-0 z-50 md:hidden bg-black/50" onClick={() => setOpen(false)}>
        <aside className="w-72 max-w-[85vw] h-full bg-gray-800 text-white p-4" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setOpen(false)} className="absolute right-4 top-4 text-white text-2xl">×</button>
          {content}
        </aside>
      </div>}
    </>
  );
}
