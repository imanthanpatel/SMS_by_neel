import { useEffect, useState } from "react";
import api from "../api";
import AdminSidebar from "../components/AdminSidebar";

const initialForm = {
  day: "",
  start_time: "",
  end_time: "",
  class_name: "",
  section: "",
  subject: "",
  teacher_id: "",
};

export default function Timetable() {
  const [teachers, setTeachers] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [loadingTimetable, setLoadingTimetable] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadTeachers = async () => {
    try {
      setLoadingTeachers(true);

      const data = await api("/api/teachers");

      setTeachers(data.teachers || data || []);
    } catch (error) {
      console.error(error);
      window.alert("Failed to load teachers");
    } finally {
      setLoadingTeachers(false);
    }
  };

  const loadTimetable = async () => {
    try {
      setLoadingTimetable(true);

      const data = await api("/api/timetable");

      setTimetable(data.timetable || data || []);
    } catch (error) {
      console.error(error);
      window.alert("Failed to load timetable");
    } finally {
      setLoadingTimetable(false);
    }
  };

  useEffect(() => {
    loadTeachers();
    loadTimetable();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      await api("/api/timetable", {
        method: "POST",
        body: JSON.stringify(form),
      });

      window.alert("Lecture added successfully!");

      setForm(initialForm);

      await loadTimetable();
    } catch (error) {
      console.error(error);
      window.alert(error.message || "Failed to add lecture");
    } finally {
      setSaving(false);
    }
  };

  const deleteLecture = async (id) => {
    if (!window.confirm("Delete this lecture?")) {
      return;
    }

    try {
      await api(`/api/timetable/${id}`, {
        method: "DELETE",
      });

      window.alert("Lecture deleted successfully!");

      await loadTimetable();
    } catch (error) {
      console.error(error);
      window.alert(error.message || "Failed to delete lecture");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Shared Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Page Header */}
        <header className="bg-white shadow-sm px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Timetable
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Create and manage lecture schedule
          </p>
        </header>

        <section className="p-6">
          {/* Add Lecture Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-5">
              <h3 className="text-xl font-bold text-gray-800">
                Add Lecture
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Create a new lecture for the school timetable.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Day */}
                <Field label="Day">
                  <select
                    name="day"
                    required
                    value={form.day}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">
                      Select Day
                    </option>

                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                    ].map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* Start Time */}
                <Field label="Start Time">
                  <input
                    type="time"
                    name="start_time"
                    required
                    value={form.start_time}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </Field>

                {/* End Time */}
                <Field label="End Time">
                  <input
                    type="time"
                    name="end_time"
                    required
                    value={form.end_time}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </Field>

                {/* Class */}
                <Field label="Class">
                  <input
                    type="text"
                    name="class_name"
                    required
                    placeholder="Example: CSE"
                    value={form.class_name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </Field>

                {/* Section */}
                <Field label="Section">
                  <input
                    type="text"
                    name="section"
                    required
                    placeholder="Example: A"
                    value={form.section}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </Field>

                {/* Subject */}
                <Field label="Subject">
                  <input
                    type="text"
                    name="subject"
                    required
                    placeholder="Example: DAA"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </Field>

                {/* Teacher */}
                <Field label="Teacher">
                  <select
                    name="teacher_id"
                    required
                    value={form.teacher_id}
                    onChange={handleChange}
                    disabled={loadingTeachers}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
                  >
                    <option value="">
                      {loadingTeachers
                        ? "Loading teachers..."
                        : "Select Teacher"}
                    </option>

                    {teachers.map((teacher) => (
                      <option
                        key={teacher._id}
                        value={teacher._id}
                      >
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={saving || loadingTeachers}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Adding..." : "➕ Add Lecture"}
              </button>
            </form>
          </div>

          {/* Lecture Schedule */}
          <div className="bg-white rounded-xl shadow-sm mt-8 overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                Lecture Schedule
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                View and manage all scheduled lectures.
              </p>
            </div>

            {loadingTimetable ? (
              <div className="p-8 text-center text-gray-500">
                Loading timetable...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "Day",
                        "Time",
                        "Class",
                        "Subject",
                        "Teacher",
                        "Action",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="text-left px-6 py-4 text-sm font-semibold text-gray-700"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {timetable.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-8 text-gray-500"
                        >
                          No lectures added yet.
                        </td>
                      </tr>
                    ) : (
                      timetable.map((lecture) => (
                        <tr
                          key={lecture._id}
                          className="border-t hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4">
                            {lecture.day}
                          </td>

                          <td className="px-6 py-4">
                            {lecture.start_time} -{" "}
                            {lecture.end_time}
                          </td>

                          <td className="px-6 py-4">
                            {lecture.class_name} -{" "}
                            {lecture.section}
                          </td>

                          <td className="px-6 py-4 font-medium text-gray-800">
                            {lecture.subject}
                          </td>

                          <td className="px-6 py-4">
                            {lecture.teacher_name}
                          </td>

                          <td className="px-6 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                deleteLecture(lecture._id)
                              }
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {children}
    </div>
  );
}