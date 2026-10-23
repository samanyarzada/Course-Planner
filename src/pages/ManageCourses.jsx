import { useState } from "react";
import CourseForm from "../components/CourseForm";
import { getSubjectStyle } from "../utils/subjectStyles";

function ManageCourses({ courses, onSave, onDelete }) {
  // The course being edited (null means we are creating a new one)
  const [editing, setEditing] = useState(null);
  // Changing this key resets the form
  const [formKey, setFormKey] = useState(0);
  // Search box for the table
  const [search, setSearch] = useState("");

  const handleEdit = (course) => {
    setEditing(course);
    setFormKey(formKey + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = (course) => {
    onSave(course);
    setEditing(null);
    setFormKey(formKey + 1);
  };

  const handleCancel = () => {
    setEditing(null);
    setFormKey(formKey + 1);
  };

  const handleDelete = (course) => {
    if (window.confirm(`Delete "${course.title}"?`)) {
      onDelete(course.id);
      // If we were editing this course, close the form
      if (editing && editing.id === course.id) {
        handleCancel();
      }
    }
  };

  // Numbers for the top cards
  const totalSeats = courses.reduce((sum, course) => sum + course.seats, 0);
  const totalFees = courses.reduce((sum, course) => sum + course.feeAFN, 0);
  const averageFee = courses.length > 0 ? Math.round(totalFees / courses.length) : 0;
  const fullCourses = courses.filter((course) => course.seats <= 0).length;

  const stats = [
    { icon: "📚", label: "Total courses", value: courses.length },
    { icon: "🪑", label: "Total seats", value: totalSeats },
    { icon: "💵", label: "Average fee", value: `${averageFee} AFN` },
    { icon: "🚫", label: "Full courses", value: fullCourses },
  ];

  // Search by title or trainer
  const visibleCourses = courses.filter((course) => {
    const text = search.toLowerCase();
    return course.title.toLowerCase().includes(text) || course.trainer.toLowerCase().includes(text);
  });

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Manage courses</h1>
        <p className="mt-2 text-gray-600">Create, edit, or delete the sample courses.</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-2xl">{stat.icon}</p>
            <p className="mt-2 text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <CourseForm key={formKey} initialData={editing} onSave={handleSave} onCancel={handleCancel} />

      {/* Table */}
      <div className="mt-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-gray-900">All courses</h2>
          <input
            type="text"
            placeholder="🔍 Search title or trainer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:w-72"
          />
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Fee</th>
                <th className="px-4 py-3">Hours</th>
                <th className="px-4 py-3">Seats</th>
                <th className="px-4 py-3">Slots</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleCourses.map((course) => {
                const style = getSubjectStyle(course.subject);

                // Seats badge color
                let seatBadge = "bg-green-50 text-green-700";
                if (course.seats <= 5) seatBadge = "bg-amber-50 text-amber-700";
                if (course.seats <= 0) seatBadge = "bg-red-50 text-red-700";

                return (
                  <tr key={course.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${style.header}`}
                        >
                          {style.icon}
                        </span>
                        <div>
                          <p className="font-semibold text-gray-900">{course.title}</p>
                          <p className="text-xs text-gray-500">{course.trainer}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium">{course.feeAFN} AFN</td>
                    <td className="px-4 py-3">{course.weeklyHours} h</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${seatBadge}`}>
                        {course.seats <= 0 ? "Full" : course.seats}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {course.slotIds.map((slot) => (
                          <span
                            key={slot}
                            className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(course)}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {visibleCourses.length === 0 && (
            <div className="p-10 text-center">
              <p className="text-3xl">📭</p>
              <p className="mt-2 text-sm text-gray-500">
                {courses.length === 0
                  ? "No courses yet. Create the first one above."
                  : "No courses match your search."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageCourses;