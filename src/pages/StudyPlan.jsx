import { Link } from "react-router-dom";
import TimetableSummary from "../components/TimetableSummary";
import BudgetControl from "../components/BudgetControl";
import { getSubjectStyle } from "../utils/subjectStyles";

function StudyPlan({ courses, planIds, onRemove, budget, setBudget }) {
  // Get the full course objects from the saved ids
  const selectedCourses = courses.filter((course) => planIds.includes(course.id));

  // Totals are recalculated every time the plan changes
  const totalFee = selectedCourses.reduce((sum, course) => sum + course.feeAFN, 0);
  const totalHours = selectedCourses.reduce((sum, course) => sum + course.weeklyHours, 0);

  // Find slots used by more than one selected course
  const slotOwners = {};
  const conflicts = [];
  selectedCourses.forEach((course) => {
    course.slotIds.forEach((slot) => {
      if (slotOwners[slot]) {
        conflicts.push({ slot, first: slotOwners[slot], second: course.title });
      } else {
        slotOwners[slot] = course.title;
      }
    });
  });

  // A simple label for the weekly study load
  let loadLabel = "Light load";
  if (totalHours > 10) loadLabel = "Balanced load";
  if (totalHours > 20) loadLabel = "Heavy load";
  if (totalHours === 0) loadLabel = "No courses yet";

  const stats = [
    { icon: "📚", label: "Courses", value: selectedCourses.length, note: "in your plan" },
    { icon: "💵", label: "Total fee", value: `${totalFee} AFN`, note: "all courses" },
    { icon: "⏱️", label: "Weekly hours", value: `${totalHours} h`, note: loadLabel },
  ];

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">My study plan</h1>
        <p className="mt-2 text-gray-600">
          Review your courses, check your budget, and see your weekly timetable.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-2xl">{stat.icon}</p>
            <p className="mt-2 text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400">{stat.note}</p>
          </div>
        ))}

        {/* Conflict status */}
        <div
          className={`rounded-2xl border p-5 shadow-sm ${
            conflicts.length === 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
          }`}
        >
          <p className="text-2xl">{conflicts.length === 0 ? "✅" : "⚠️"}</p>
          <p className="mt-2 text-sm text-gray-500">Schedule</p>
          <p
            className={`text-2xl font-extrabold ${
              conflicts.length === 0 ? "text-green-700" : "text-red-700"
            }`}
          >
            {conflicts.length === 0 ? "No conflicts" : `${conflicts.length} conflict(s)`}
          </p>
          <p className="text-xs text-gray-400">same day and time</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left side: selected courses */}
        <div className="space-y-4 lg:col-span-2">
          {/* Conflict warning */}
          {conflicts.length > 0 && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p className="font-bold">Time conflict found</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {conflicts.map((conflict) => (
                  <li key={conflict.slot + conflict.second}>
                    "{conflict.first}" and "{conflict.second}" both use slot {conflict.slot}.
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h2 className="text-lg font-bold text-gray-900">Selected courses</h2>

          {selectedCourses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <p className="text-4xl">🛒</p>
              <h3 className="mt-3 text-lg font-semibold text-gray-900">Your study plan is empty</h3>
              <p className="mt-1 text-sm text-gray-500">Add courses to see your fee and timetable.</p>
              <Link
                to="/courses"
                className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Browse courses
              </Link>
            </div>
          ) : (
            selectedCourses.map((course) => {
              const style = getSubjectStyle(course.subject);
              return (
                <div
                  key={course.id}
                  className="flex flex-wrap items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${style.header} text-2xl`}
                  >
                    {style.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/courses/${course.id}`}
                      className="font-bold text-gray-900 hover:text-blue-600"
                    >
                      {course.title}
                    </Link>
                    <p className="text-sm text-gray-500">Trainer: {course.trainer}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-md bg-gray-100 px-2 py-1 font-medium text-gray-700">
                        {course.feeAFN} AFN
                      </span>
                      <span className="rounded-md bg-gray-100 px-2 py-1 font-medium text-gray-700">
                        {course.weeklyHours} h/week
                      </span>
                      {course.slotIds.map((slot) => (
                        <span key={slot} className="rounded-md bg-blue-50 px-2 py-1 font-medium text-blue-700">
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onRemove(course.id)}
                    className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                  >
                    Remove
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Right side: budget and enquiry */}
        <BudgetControl budget={budget} setBudget={setBudget} totalFee={totalFee} />
      </div>

      {/* Timetable */}
      <div className="mt-8">
        <TimetableSummary courses={selectedCourses} />
      </div>
    </div>
  );
}

export default StudyPlan;