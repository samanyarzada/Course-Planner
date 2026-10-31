import { Link } from "react-router-dom";
import TimetableSummary from "../components/TimetableSummary";
import BudgetControl from "../components/BudgetControl";
import Icon from "../components/Icons";
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
    { icon: "book", label: "Courses", value: selectedCourses.length, note: "in your plan" },
    { icon: "wallet", label: "Total fee", value: `${totalFee} AFN`, note: "all courses" },
    { icon: "clock", label: "Weekly hours", value: `${totalHours} h`, note: loadLabel },
  ];

  const noConflicts = conflicts.length === 0;

  return (
    <div className="animate-fade-up">
      <div className="mb-10">
        <p className="eyebrow">Your journey</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink md:text-5xl">My study plan</h1>
        <span className="gold-rule mt-4" />
        <p className="mt-4 max-w-2xl text-muted">
          Review your courses, check your budget, and see your weekly timetable.
        </p>
      </div>

      {/* Stats */}
      <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card-lux card-lux-hover group p-5">
            <span className="icon-badge h-11 w-11">
              <Icon name={stat.icon} className="h-5 w-5" />
            </span>
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.15em] text-muted">
              {stat.label}
            </p>
            <p className="mt-1 font-display text-2xl font-semibold text-ink">{stat.value}</p>
            <p className="text-xs text-muted">{stat.note}</p>
          </div>
        ))}

        {/* Conflict status */}
        <div
          className={`card-lux card-lux-hover p-5 ${
            noConflicts ? "bg-emerald-deep/5!" : "border-red-200! bg-red-50!"
          }`}
        >
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-[0.9rem] text-white shadow-md ${
              noConflicts
                ? "bg-linear-to-br from-emerald-soft to-emerald-deep"
                : "bg-linear-to-br from-red-500 to-red-700"
            }`}
          >
            <Icon name={noConflicts ? "calendarCheck" : "alert"} className="h-5 w-5" />
          </span>
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.15em] text-muted">Schedule</p>
          <p
            className={`mt-1 font-display text-2xl font-semibold ${
              noConflicts ? "text-emerald-deep" : "text-red-700"
            }`}
          >
            {noConflicts ? "No conflicts" : `${conflicts.length} conflict(s)`}
          </p>
          <p className="text-xs text-muted">same day and time</p>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {/* Left side: selected courses */}
        <div className="space-y-4 lg:col-span-2">
          {/* Conflict warning */}
          {conflicts.length > 0 && (
            <div className="animate-drop rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              <p className="flex items-center gap-2 font-semibold">
                <Icon name="alert" className="h-4 w-4" />
                Time conflict found
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                {conflicts.map((conflict) => (
                  <li key={conflict.slot + conflict.second}>
                    "{conflict.first}" and "{conflict.second}" both use slot {conflict.slot}.
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h2 className="font-display text-2xl font-semibold text-ink">Selected courses</h2>

          {selectedCourses.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gold-light bg-white p-14 text-center">
              <span className="icon-badge mx-auto h-16 w-16">
                <Icon name="bag" className="h-7 w-7" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-ink">
                Your study plan is empty
              </h3>
              <p className="mt-1 text-sm text-muted">Add courses to see your fee and timetable.</p>
              <Link to="/courses" className="btn-gold mt-6">
                Browse courses
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="stagger space-y-4">
              {selectedCourses.map((course) => {
                const style = getSubjectStyle(course.subject);
                return (
                  <div
                    key={course.id}
                    className="card-lux card-lux-hover group flex flex-wrap items-center gap-4 p-4"
                  >
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${style.header} text-white shadow-md transition-transform duration-500 group-hover:-rotate-6`}
                    >
                      <Icon name={style.iconName} className="h-6 w-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/courses/${course.id}`}
                        className="font-display text-lg font-semibold text-ink transition hover:text-gold-dark"
                      >
                        {course.title}
                      </Link>
                      <p className="text-sm text-muted">Trainer: {course.trainer}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-md bg-cream px-2 py-1 font-medium text-ink-soft">
                          {course.feeAFN} AFN
                        </span>
                        <span className="rounded-md bg-cream px-2 py-1 font-medium text-ink-soft">
                          {course.weeklyHours} h/week
                        </span>
                        {course.slotIds.map((slot) => (
                          <span
                            key={slot}
                            className="rounded-md border border-gold-light bg-white px-2 py-1 font-medium tracking-wide text-gold-dark"
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => onRemove(course.id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition-all duration-300 hover:bg-red-100 active:scale-95"
                    >
                      <Icon name="trash" className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right side: budget and enquiry */}
        <BudgetControl budget={budget} setBudget={setBudget} totalFee={totalFee} />
      </div>

      {/* Timetable */}
      <div className="mt-10">
        <TimetableSummary courses={selectedCourses} />
      </div>
    </div>
  );
}

export default StudyPlan;