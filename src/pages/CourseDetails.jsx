import { Link, useParams } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import { getSubjectStyle } from "../utils/subjectStyles";

// Full day names for the schedule list
const DAY_NAMES = {
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
};

function CourseDetails({ courses, loading, planIds, onAdd, onRemove }) {
  // useParams reads the id from the URL: /courses/:id
  const { id } = useParams();

  if (loading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-gray-200" />;
  }

  const course = courses.find((c) => c.id === Number(id));

  if (!course) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <p className="text-4xl">😕</p>
        <h2 className="mt-3 text-lg font-semibold text-gray-900">Course not found</h2>
        <Link
          to="/courses"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Back to courses
        </Link>
      </div>
    );
  }

  const style = getSubjectStyle(course.subject);
  const inPlan = planIds.includes(course.id);
  const noSeats = course.seats <= 0;

  // Fee for each weekly hour (a simple extra number)
  const feePerHour = Math.round(course.feeAFN / course.weeklyHours);

  // Other courses with the same subject
  const relatedCourses = courses
    .filter((c) => c.subject === course.subject && c.id !== course.id)
    .slice(0, 2);

  return (
    <div className="animate-fade-up">
      <Link to="/courses" className="text-sm font-medium text-blue-600 hover:underline">
        ← Back to courses
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        {/* Left side: main information */}
        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className={`bg-linear-to-br ${style.header} px-6 py-8 text-white`}>
              <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
                {style.icon} {style.label}
              </span>
              <h1 className="mt-4 text-3xl font-extrabold">{course.title}</h1>
              <div className="mt-3 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
                  {course.trainer.charAt(0)}
                </span>
                <span className="text-sm text-white/90">Trainer: {course.trainer}</span>
              </div>
            </div>

            <div className="p-6">
              <h2 className="font-bold text-gray-900">About this course</h2>
              <p className="mt-2 leading-relaxed text-gray-600">{course.description}</p>
            </div>
          </div>

          {/* Weekly schedule */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-gray-900">Weekly schedule</h2>
            <ul className="mt-4 space-y-3">
              {course.slotIds.map((slot) => {
                const [day, hour] = slot.split("-");
                return (
                  <li key={slot} className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                        {day}
                      </span>
                      <span className="font-medium text-gray-800">{DAY_NAMES[day] || day}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {hour}:00 <span className="text-gray-400">· {slot}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Right side: price and action */}
        <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <p className="text-sm text-gray-500">Course fee</p>
          <p className="text-3xl font-extrabold text-gray-900">{course.feeAFN} AFN</p>
          <p className="mt-1 text-xs text-gray-500">About {feePerHour} AFN per weekly hour</p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Weekly hours</p>
              <p className="font-bold text-gray-900">{course.weeklyHours} h</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Seats</p>
              <p className={`font-bold ${noSeats ? "text-red-600" : "text-gray-900"}`}>
                {noSeats ? "Full" : course.seats}
              </p>
            </div>
          </div>

          <div className="mt-5">
            {inPlan ? (
              <>
                <p className="mb-3 rounded-lg bg-blue-50 px-3 py-2 text-center text-sm font-medium text-blue-700">
                  ✓ This course is in your plan
                </p>
                <button
                  onClick={() => onRemove(course.id)}
                  className="w-full rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100"
                >
                  Remove from plan
                </button>
              </>
            ) : (
              <button
                onClick={() => onAdd(course.id)}
                disabled={noSeats}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
              >
                {noSeats ? "No seats available" : "Add to plan"}
              </button>
            )}

            <Link
              to="/study-plan"
              className="mt-3 block text-center text-sm font-medium text-blue-600 hover:underline"
            >
              Go to my study plan
            </Link>
          </div>
        </div>
      </div>

      {/* Related courses */}
      {relatedCourses.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-extrabold text-gray-900">More in {style.label}</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedCourses.map((related) => (
              <CourseCard
                key={related.id}
                course={related}
                inPlan={planIds.includes(related.id)}
                onAdd={onAdd}
                onRemove={onRemove}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default CourseDetails;