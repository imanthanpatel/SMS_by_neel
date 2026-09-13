import { Link } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <AdminSidebar />

      <main className="flex-1">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-sm text-gray-500 mt-1">Welcome back, Admin 👋</p>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative text-xl">
              🔔
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">A</div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">School Admin</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <section className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Students" value="500" icon="👨‍🎓" note="↑ 12% from last month" noteClass="text-green-600" />
            <StatCard label="Total Teachers" value="30" icon="👨‍🏫" note="↑ 5% from last month" noteClass="text-green-600" />
            <StatCard label="Total Classes" value="20" icon="🏫" note="Academic Year 2026-27" noteClass="text-gray-500" />
            <StatCard label="Pending Fees" value="₹50,000" icon="💰" note="Needs attention" noteClass="text-red-600" />
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <QuickAction to="/students" icon="➕" title="Add Student" text="Register a new student" className="bg-blue-600 hover:bg-blue-700" />
              <QuickAction to="#" icon="👨‍🏫" title="Add Teacher" text="Register a teacher" className="bg-green-600 hover:bg-green-700" />
              <QuickAction to="#" icon="🏫" title="Create Class" text="Create a new class" className="bg-purple-600 hover:bg-purple-700" />
              <QuickAction to="#" icon="📢" title="Notice" text="Publish a school notice" className="bg-orange-500 hover:bg-orange-600" />
            </div>
          </div>

          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-5">Recent Activity</h3>
            <Activity icon="👨‍🎓" title="New student registered" time="Today, 10:30 AM" />
            <Activity icon="💰" title="Fee payment received" time="Today, 09:45 AM" />
            <Activity icon="📢" title="New notice published" time="Yesterday, 04:20 PM" />
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, note, noteClass }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">{value}</h3>
        </div>
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">{icon}</div>
      </div>
      <p className={`text-sm mt-4 ${noteClass}`}>{note}</p>
    </div>
  );
}

function QuickAction({ to, icon, title, text, className }) {
  return (
    <Link to={to} className={`text-white rounded-xl p-5 text-left transition block ${className}`}>
      <div className="text-2xl mb-3">{icon}</div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm opacity-90 mt-1">{text}</p>
    </Link>
  );
}

function Activity({ icon, title, time }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b last:border-b-0">
      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">{icon}</div>
      <div>
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
    </div>
  );
}
