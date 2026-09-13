import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import api from "../api";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    student_id: "",
    name: "",
    email: "",
    phone: "",
    class_name: "",
    section: "",
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api("/api/students");
      setStudents(data.students || data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api("/api/students", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setSuccess("Student added successfully.");

      setForm({
        student_id: "",
        name: "",
        email: "",
        phone: "",
        class_name: "",
        section: "",
      });

      setShowForm(false);
      await loadStudents();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to add student");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />

        <main className="flex-1 p-6">
          <div className="text-gray-600">
            Loading students...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-x-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Students
            </h1>

            <p className="mt-1 text-gray-500">
              Manage students and their information
            </p>
          </div>

          <button
            onClick={() => {
              setShowForm(true);
              setSuccess("");
              setError("");
            }}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            + Add Student
          </button>
        </div>

        {/* Success */}
        {success && (
          <div className="mb-5 rounded-lg border border-green-300 bg-green-100 px-4 py-3 text-green-700">
            {success}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {/* Add Student Form */}
        {showForm && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Add New Student
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter the student's information below
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-2xl text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleAddStudent}
              className="grid grid-cols-1 gap-5 md:grid-cols-2"
            >
              {/* Student ID */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Student ID
                </label>

                <input
                  type="text"
                  name="student_id"
                  value={form.student_id}
                  onChange={handleChange}
                  required
                  placeholder="Enter student ID"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Name */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter student name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter phone number"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Class */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Class
                </label>

                <input
                  type="text"
                  name="class_name"
                  value={form.class_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter class"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Section */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Section
                </label>

                <input
                  type="text"
                  name="section"
                  value={form.section}
                  onChange={handleChange}
                  required
                  placeholder="Enter section"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Adding..." : "Add Student"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Students Table */}
        <div className="rounded-xl bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Student ID
                  </th>

                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Name
                  </th>

                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Email
                  </th>

                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Phone
                  </th>

                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Class
                  </th>

                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Section
                  </th>
                </tr>
              </thead>

              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-8 text-center text-gray-500"
                    >
                      No students found.
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr
                      key={student._id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="p-4">
                        {student.student_id}
                      </td>

                      <td className="p-4 font-medium text-gray-800">
                        {student.name}
                      </td>

                      <td className="p-4 text-gray-600">
                        {student.email}
                      </td>

                      <td className="p-4 text-gray-600">
                        {student.phone}
                      </td>

                      <td className="p-4 text-gray-600">
                        {student.class_name}
                      </td>

                      <td className="p-4 text-gray-600">
                        {student.section}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}