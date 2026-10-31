import { Link, useParams } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import Icon from "../components/Icons";
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
    return <div className="h-96 animate-pulse rounded-3xl bg-sand" />;
  }

  const course = courses.find((c) => c.id === Number(id));

  if (!course) {
    return (
      <div className="animate-fade-up rounded-3xl border border-dashed border-gold-light bg-white p-14 text-center">
        <span className="icon-badge mx-auto h-16 w-16">
          <Icon name="frown" className="h-7 w-7" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold text-ink">Course not found</h2>
        <Link to="/courses" className="btn-gold mt-6">
          <Icon name="arrowLeft" className="h-4 w-4" />
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
      <Link
        to="/courses"
        className="group inline-flex items-center gap-2 text-sm font-medium text-gold-dark transition hover:text-ink"
      >
        <Icon
          name="arrowLeft"
          className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
        />
        Back to courses
      </Link>

      <div className="mt-5 grid gap-8 lg:grid-cols-3">
        {/* Left side: main information */}
        <div className="space-y-6 lg:col-span-2">
          <div className="card-lux overflow-hidden">
            <div className={`relative overflow-hidden bg-linear-to-br ${style.header} px-7 py-10 text-white`}>
              {/* Decorative circles */}
              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10" />
              <div className="absolute -bottom-16 right-24 h-36 w-36 rounded-full bg-white/5" />

              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur">
                  <Icon name={style.iconName} className="h-4 w-4" />
                  {style.label}
                </span>
                <h1 className="mt-5 text-3xl font-semibold leading-tight md:text-4xl">{course.title}</h1>
                <div className="mt-4 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
                    {course.trainer.charAt(0)}
                  </span>
                  <span className="text-sm text-white/90">Trainer: {course.trainer}</span>
                </div>
              </div>
            </div>

            <div className="p-7">
              <p className="eyebrow">Overview</p>
              <h2 className="mt-2 text-xl font-semibold text-ink">About this course</h2>
              <span className="gold-rule mt-3" />
              <p className="mt-4 leading-relaxed text-muted">{course.description}</p>
            </div>
          </div>

          {/* Weekly schedule */}
          <div className="card-lux p-7">
            <div className="flex items-center gap-3">
              <span className="icon-badge h-10 w-10">
                <Icon name="calendar" className="h-5 w-5" />
              </span>
              <h2 className="font-display text-xl font-semibold text-ink">Weekly schedule</h2>
            </div>

            <ul className="stagger mt-5 space-y-3">
              {course.slotIds.map((slot) => {
                const [day, hour] = slot.split("-");
                return (
                  <li
                    key={slot}
                    className="flex items-center justify-between rounded-2xl border border-line bg-cream p-4 transition-all duration-300 hover:border-gold-light hover:bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-12 items-center justify-center rounded-xl bg-ink text-xs font-bold tracking-wider text-gold-light">
                        {day}
                      </span>
                      <span className="font-medium text-ink">{DAY_NAMES[day] || day}</span>
                    </div>
                    <span className="flex items-center gap-2 text-sm text-ink-soft">
                      <Icon name="clock" className="h-4 w-4 text-gold-dark" />
                      {hour}:00 <span className="text-muted">· {slot}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Right side: price and action */}
        <div className="card-lux h-fit p-7 lg:sticky lg:top-28">
          <p className="eyebrow">Course fee</p>
          <p className="mt-2 font-display text-4xl font-semibold text-ink">{course.feeAFN} AFN</p>
          <p className="mt-1 text-xs text-muted">About {feePerHour} AFN per weekly hour</p>

          <div className="mt-6 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-2xl border border-line bg-cream p-3">
              <p className="text-xs text-muted">Weekly hours</p>
              <p className="mt-1 font-semibold text-ink">{course.weeklyHours} h</p>
            </div>
            <div className="rounded-2xl border border-line bg-cream p-3">
              <p className="text-xs text-muted">Seats</p>
              <p className={`mt-1 font-semibold ${noSeats ? "text-red-600" : "text-ink"}`}>
                {noSeats ? "Full" : course.seats}
              </p>
            </div>
          </div>

          <div className="mt-6">
            {inPlan ? (
              <>
                <p className="mb-3 flex items-center justify-center gap-2 rounded-xl border border-gold-light bg-gold/10 px-3 py-2.5 text-center text-sm font-medium text-gold-dark">
                  <Icon name="checkCircle" className="h-4 w-4" />
                  This course is in your plan
                </p>
                <button
                  onClick={() => onRemove(course.id)}
                  className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition-all duration-300 hover:bg-red-100 active:scale-95"
                >
                  Remove from plan
                </button>
              </>
            ) : (
              <button
                onClick={() => onAdd(course.id)}
                disabled={noSeats}
                className="btn-gold w-full py-3.5"
              >
                {noSeats ? "No seats available" : "Add to plan"}
              </button>
            )}

            <Link
              to="/study-plan"
              className="group mt-4 flex items-center justify-center gap-2 text-sm font-medium text-gold-dark transition hover:text-ink"
            >
              Go to my study plan
              <Icon
                name="arrowRight"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Related courses */}
      {relatedCourses.length > 0 && (
        <section className="mt-20">
          <p className="eyebrow">Continue exploring</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">More in {style.label}</h2>
          <span className="gold-rule mt-4" />
          <div className="stagger mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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