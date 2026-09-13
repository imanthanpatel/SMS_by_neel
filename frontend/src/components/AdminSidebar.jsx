import { useState } from "react";
import { NavLink } from "react-router-dom";
import LogoutLink from "./LogoutLink";

const links = [
  ["🏠", "Dashboard", "/dashboard/admin"],
  ["👨‍🎓", "Students", "/students"],
  ["👨‍🏫", "Teachers", "#"],
  ["🏫", "Classes", "#"],
  ["📚", "Subjects", "#"],
  ["🕐", "Timetable", "/timetable"],
  ["📊", "Results", "#"],
  ["💰", "Fees & Payments", "#"],
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive ? "bg-blue-600" : "hover:bg-slate-800"}`;

  const content = (
    <>
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">School<span className="text-blue-400">MS</span></h1>
        <p className="text-xs text-slate-400 mt-1">Management System</p>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map(([icon, label, to]) => to === "#" ? (
          <a key={label} href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition">{icon}<span>{label}</span></a>
        ) : (
          <NavLink key={label} to={to} onClick={() => setOpen(false)} className={navClass}>{icon}<span>{label}</span></NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <LogoutLink className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition" />
      </div>
    </>
  );

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed top-4 left-4 z-50 md:hidden bg-slate-900 text-white rounded-lg px-3 py-2 shadow-lg" aria-label="Open menu">☰</button>
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col min-h-screen sticky top-0">{content}</aside>
      {open && <div className="fixed inset-0 z-50 md:hidden bg-black/50" onClick={() => setOpen(false)}>
        <aside className="w-72 max-w-[85vw] h-full bg-slate-900 text-white flex flex-col" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setOpen(false)} className="absolute right-4 top-4 text-white text-2xl" aria-label="Close menu">×</button>
          {content}
        </aside>
      </div>}
    </>
  );
}
