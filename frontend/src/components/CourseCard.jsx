import { Link } from "react-router-dom";
import { getSubjectStyle } from "../utils/subjectStyles";
import Icon from "./Icons";

// We use 20 seats as the full size of the seat bar
const MAX_SEATS = 20;

// Shows one course. All actions come from the parent through props.
function CourseCard({ course, inPlan, onAdd, onRemove }) {
  const style = getSubjectStyle(course.subject);
  const noSeats = course.seats <= 0;

  // Width of the seat bar (0 to 100)
  const seatPercent = Math.min((course.seats / MAX_SEATS) * 100, 100);

  // Bar color: green = many seats, gold = few seats, red = full
  let seatColor = "bg-emerald-soft";
  if (course.seats <= 5) seatColor = "bg-gold";
  if (noSeats) seatColor = "bg-red-500";

  return (
    <div
      className={`card-lux card-lux-hover group flex flex-col overflow-hidden ${
        inPlan ? "border-gold! ring-4 ring-gold/15" : ""
      }`}
    >
      {/* Colored header */}
      <div className={`relative overflow-hidden bg-linear-to-br ${style.header} px-5 py-5 text-white`}>
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 transition-transform duration-700 group-hover:scale-125" />
        <div className="absolute -bottom-10 right-10 h-20 w-20 rounded-full bg-white/5" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/15 backdrop-blur transition-transform duration-500 group-hover:-rotate-6">
              <Icon name={style.iconName} className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
              {style.label}
            </span>
          </div>

          {inPlan && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gold-dark shadow-sm">
              <Icon name="check" className="h-3 w-3" strokeWidth={2.5} />
              In plan
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-semibold leading-snug text-ink">{course.title}</h3>

        {/* Trainer */}
        <div className="mt-3 flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-gold-light to-gold text-xs font-bold text-ink">
            {course.trainer.charAt(0)}
          </span>
          <span className="text-sm text-muted">{course.trainer}</span>
        </div>

        {/* Fee and hours */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-line bg-cream p-3">
            <p className="flex items-center gap-1.5 text-xs text-muted">
              <Icon name="wallet" className="h-3.5 w-3.5 text-gold-dark" />
              Fee
            </p>
            <p className="mt-1 font-semibold text-ink">{course.feeAFN} AFN</p>
          </div>
          <div className="rounded-xl border border-line bg-cream p-3">
            <p className="flex items-center gap-1.5 text-xs text-muted">
              <Icon name="clock" className="h-3.5 w-3.5 text-gold-dark" />
              Weekly hours
            </p>
            <p className="mt-1 font-semibold text-ink">{course.weeklyHours} h</p>
          </div>
        </div>

        {/* Seats bar */}
        <div className="mt-5">
          <div className="mb-1.5 flex justify-between text-xs">
            <span className="flex items-center gap-1.5 text-muted">
              <Icon name="users" className="h-3.5 w-3.5" />
              Seats
            </span>
            <span className={`font-semibold ${noSeats ? "text-red-600" : "text-ink-soft"}`}>
              {noSeats ? "Full" : `${course.seats} left`}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-sand">
            <div
              className={`h-full origin-left animate-grow rounded-full ${seatColor}`}
              style={{ width: `${seatPercent}%` }}
            />
          </div>
        </div>

        {/* Meeting slots */}
        <div className="mt-5 flex flex-wrap gap-2">
          {course.slotIds.map((slot) => (
            <span
              key={slot}
              className="rounded-md border border-line bg-white px-2 py-1 text-xs font-medium tracking-wide text-ink-soft"
            >
              {slot}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-auto flex gap-2 pt-6">
          <Link to={`/courses/${course.id}`} className="btn-outline flex-1 px-3 py-2.5">
            Details
          </Link>

          {inPlan ? (
            <button
              onClick={() => onRemove(course.id)}
              className="flex-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700 transition-all duration-300 hover:bg-red-100 active:scale-95"
            >
              Remove
            </button>
          ) : (
            <button
              onClick={() => onAdd(course.id)}
              disabled={noSeats}
              className="btn-gold flex-1 px-3 py-2.5"
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