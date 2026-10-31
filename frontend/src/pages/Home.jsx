import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import Icon from "../components/Icons";
import { subjectStyles } from "../utils/subjectStyles";

function Home({ courses, loading, planIds, onAdd, onRemove }) {
  // Numbers for the hero stats (calculated from the courses)
  const subjectCount = new Set(courses.map((course) => course.subject)).size;
  const trainerCount = new Set(courses.map((course) => course.trainer)).size;
  const openSeats = courses.reduce((sum, course) => sum + course.seats, 0);

  const stats = [
    { label: "Courses", value: courses.length, icon: "book" },
    { label: "Subjects", value: subjectCount, icon: "sparkles" },
    { label: "Trainers", value: trainerCount, icon: "cap" },
    { label: "Open seats", value: openSeats, icon: "users" },
  ];

  // First 3 courses that still have seats
  const featuredCourses = courses.filter((course) => course.seats > 0).slice(0, 3);

  const steps = [
    {
      number: "01",
      title: "Browse courses",
      text: "Search by title or trainer, filter by subject, and sort by fee.",
    },
    {
      number: "02",
      title: "Build your plan",
      text: "Add courses to your study plan. We calculate the total fee and weekly hours.",
    },
    {
      number: "03",
      title: "Check your schedule",
      text: "We warn you if two courses use the same day and time, and show your budget balance.",
    },
  ];

  return (
    <div className="animate-fade-up space-y-24">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-16 text-white shadow-2xl shadow-ink/30 md:px-14 md:py-20">
        {/* Background glows and circles */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(184,149,90,0.28),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(59,74,114,0.45),transparent_55%)]" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 animate-float rounded-full border border-gold/30" />
        <div className="pointer-events-none absolute -right-4 top-10 h-40 w-40 animate-float rounded-full border border-gold/20 [animation-delay:1.5s]" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-gold/5 blur-2xl" />

        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-light backdrop-blur">
            <Icon name="cap" className="h-4 w-4" />
            Training centre course planner
          </span>

          <h1 className="mt-7 text-4xl font-semibold leading-[1.1] md:text-6xl">
            Plan your learning with <span className="italic text-gold-gradient">confidence</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
            Choose the right courses, avoid time conflicts, and stay inside your budget, all in one
            place.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/courses" className="btn-gold px-7 py-3.5">
              Browse courses
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
            <Link
              to="/study-plan"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-gold hover:bg-white/10 hover:text-gold-light active:scale-95"
            >
              My study plan
              {planIds.length > 0 && (
                <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-ink">
                  {planIds.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="stagger relative mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:bg-white/10"
            >
              <span className="icon-badge-dark h-10 w-10">
                <Icon name={stat.icon} className="h-5 w-5" />
              </span>
              <p className="mt-4 font-display text-4xl font-semibold text-white">{stat.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Subjects */}
      <section>
        <p className="eyebrow">Disciplines</p>
        <h2 className="mt-2 text-3xl font-semibold text-ink md:text-4xl">Choose your subject</h2>
        <span className="gold-rule mt-4" />
        <p className="mt-4 text-muted">Three areas to start your learning journey.</p>

        <div className="stagger mt-8 grid gap-6 md:grid-cols-3">
          {Object.keys(subjectStyles).map((key) => {
            const style = subjectStyles[key];
            const count = courses.filter((course) => course.subject === key).length;

            return (
              <Link
                key={key}
                to="/courses"
                className="card-lux card-lux-hover group relative overflow-hidden p-7"
              >
                {/* Soft color glow in the corner */}
                <div
                  className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-linear-to-br ${style.header} opacity-10 transition-all duration-700 group-hover:scale-150 group-hover:opacity-20`}
                />

                <div
                  className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${style.header} text-white shadow-lg transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110`}
                >
                  <Icon name={style.iconName} className="h-6 w-6" />
                </div>

                <h3 className="relative mt-6 font-display text-xl font-semibold text-ink">
                  {style.label}
                </h3>
                <p className="relative mt-1 text-sm text-muted">
                  {count} {count === 1 ? "course" : "courses"} available
                </p>

                <p className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-dark">
                  View courses
                  <Icon
                    name="arrowRight"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                  />
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured courses */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Handpicked</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink md:text-4xl">Featured courses</h2>
            <span className="gold-rule mt-4" />
            <p className="mt-4 text-muted">Popular courses with seats available now.</p>
          </div>
          <Link
            to="/courses"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-gold-dark transition hover:text-ink"
          >
            See all
            <Icon
              name="arrowRight"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
            />
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-96 animate-pulse rounded-3xl bg-sand" />
            ))}
          </div>
        ) : (
          <div className="stagger mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                inPlan={planIds.includes(course.id)}
                onAdd={onAdd}
                onRemove={onRemove}
              />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section>
        <p className="eyebrow">Simple process</p>
        <h2 className="mt-2 text-3xl font-semibold text-ink md:text-4xl">How it works</h2>
        <span className="gold-rule mt-4" />

        <div className="stagger mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="card-lux card-lux-hover group p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-light bg-cream font-display text-lg font-semibold text-gold-dark transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                {step.number}
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-16 text-center text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,149,90,0.22),transparent_65%)]" />
        <div className="relative">
          <span className="gold-rule mx-auto" />
          <h2 className="mt-6 text-3xl font-semibold md:text-4xl">Ready to build your study plan?</h2>
          <p className="mx-auto mt-3 max-w-md text-gray-400">
            Pick your courses and see your weekly timetable in a few clicks.
          </p>
          <Link to="/courses" className="btn-gold mt-8 px-8 py-3.5">
            Start now
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;