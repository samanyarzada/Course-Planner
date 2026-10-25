import { Link } from "react-router-dom";
import { getSubjectStyle } from "../utils/subjectStyles";

// We use 20 seats as the full size of the seat bar
const MAX_SEATS = 20;

// Shows one course. All actions come from the parent through props.
function CourseCard({ course, inPlan, onAdd, onRemove }) {
  const style = getSubjectStyle(course.subject);
  const noSeats = course.seats <= 0;

  // Width of the seat bar (0 to 100)
  const seatPercent = Math.min((course.seats / MAX_SEATS) * 100, 100);

  // Bar color: green = many seats, amber = few seats, red = full
  let seatColor = "bg-green-500";
  if (course.seats <= 5) seatColor = "bg-amber-500";
  if (noSeats) seatColor = "bg-red-500";

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
        inPlan ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"
      }`}
    >
      {/* Colored header */}
      <div
        className={`flex items-center justify-between bg-linear-to-br ${style.header} px-5 py-4 text-white`}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">{style.icon}</span>
          <span className="text-sm font-semibold">{style.label}</span>
        </div>
        {inPlan && (
          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-blue-700">
            ✓ In plan
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>

        {/* Trainer */}
        <div className="mt-2 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
            {course.trainer.charAt(0)}
          </span>
          <span className="text-sm text-gray-500">{course.trainer}</span>
        </div>

        {/* Fee and hours */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Fee</p>
            <p className="font-bold text-gray-900">{course.feeAFN} AFN</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Weekly hours</p>
            <p className="font-bold text-gray-900">{course.weeklyHours} h</p>
          </div>
        </div>

        {/* Seats bar */}
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-gray-500">Seats</span>
            <span className={`font-semibold ${noSeats ? "text-red-600" : "text-gray-700"}`}>
              {noSeats ? "Full" : `${course.seats} left`}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div className={`h-full rounded-full ${seatColor}`} style={{ width: `${seatPercent}%` }} />
          </div>
        </div>

        {/* Meeting slots */}
        <div className="mt-4 flex flex-wrap gap-2">
          {course.slotIds.map((slot) => (
            <span
              key={slot}
              className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
            >
              {slot}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-auto flex gap-2 pt-5">
          <Link
            to={`/courses/${course.id}`}
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Details
          </Link>

          {inPlan ? (
            <button
              onClick={() => onRemove(course.id)}
              className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
            >
              Remove
            </button>
          ) : (
            <button
              onClick={() => onAdd(course.id)}
              disabled={noSeats}
              className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
            >
              {noSeats ? "No seats" : "Add to plan"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;