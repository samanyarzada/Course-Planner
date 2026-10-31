import { useState } from "react";
import CourseForm from "../components/CourseForm";
import Icon from "../components/Icons";
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
    { icon: "book", label: "Total courses", value: courses.length },
    { icon: "users", label: "Total seats", value: totalSeats },
    { icon: "wallet", label: "Average fee", value: `${averageFee} AFN` },
    { icon: "ban", label: "Full courses", value: fullCourses },
  ];

  // Search by title or trainer
  const visibleCourses = courses.filter((course) => {
    const text = search.toLowerCase();
    return course.title.toLowerCase().includes(text) || course.trainer.toLowerCase().includes(text);
  });

  return (
    <div className="animate-fade-up">
      <div className="mb-10">
        <p className="eyebrow">Administration</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink md:text-5xl">Manage courses</h1>
        <span className="gold-rule mt-4" />
        <p className="mt-4 max-w-2xl text-muted">Create, edit, or delete the sample courses.</p>
      </div>

      {/* Stats */}
      <div className="stagger mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card-lux card-lux-hover group p-5">
            <span className="icon-badge h-11 w-11">
              <Icon name={stat.icon} className="h-5 w-5" />
            </span>
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.15em] text-muted">
              {stat.label}
            </p>
            <p className="mt-1 font-display text-2xl font-semibold text-ink">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <CourseForm key={formKey} initialData={editing} onSave={handleSave} onCancel={handleCancel} />

      {/* Table */}
      <div className="mt-14">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold text-ink">All courses</h2>
          <div className="relative w-full sm:w-72">
            <Icon
              name="search"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              placeholder="Search title or trainer"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-lux pl-10"
            />
          </div>
        </div>

        <div className="card-lux overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-[0.7rem] uppercase tracking-[0.15em] text-gold-dark">
              <tr>
                <th className="px-5 py-4">Course</th>
                <th className="px-5 py-4">Fee</th>
                <th className="px-5 py-4">Hours</th>
                <th className="px-5 py-4">Seats</th>
                <th className="px-5 py-4">Slots</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleCourses.map((course) => {
                const style = getSubjectStyle(course.subject);

                // Seats badge color
                let seatBadge = "bg-emerald-deep/10 text-emerald-deep";
                if (course.seats <= 5) seatBadge = "bg-gold/15 text-gold-dark";
                if (course.seats <= 0) seatBadge = "bg-red-50 text-red-700";

                return (
                  <tr
                    key={course.id}
                    className="border-t border-line transition-colors duration-300 hover:bg-cream"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${style.header} text-white shadow-sm`}
                        >
                          <Icon name={style.iconName} className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-semibold text-ink">{course.title}</p>
                          <p className="text-xs text-muted">{course.trainer}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-ink">
                      {course.feeAFN} AFN
                    </td>
                    <td className="px-5 py-4 text-ink-soft">{course.weeklyHours} h</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${seatBadge}`}>
                        {course.seats <= 0 ? "Full" : course.seats}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {course.slotIds.map((slot) => (
                          <span
                            key={slot}
                            className="rounded-md border border-line bg-white px-2 py-0.5 text-xs font-medium tracking-wide text-ink-soft"
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink transition-all duration-300 hover:border-gold hover:text-gold-dark active:scale-95"
                        >
                          <Icon name="edit" className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(course)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition-all duration-300 hover:bg-red-100 active:scale-95"
                        >
                          <Icon name="trash" className="h-3.5 w-3.5" />
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
            <div className="p-12 text-center">
              <span className="icon-badge mx-auto h-14 w-14">
                <Icon name="inbox" className="h-6 w-6" />
              </span>
              <p className="mt-3 text-sm text-muted">
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