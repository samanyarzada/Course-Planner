import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import { subjectStyles } from "../utils/subjectStyles";

function Home({ courses, loading, planIds, onAdd, onRemove }) {
  // Numbers for the hero stats (calculated from the courses)
  const subjectCount = new Set(courses.map((course) => course.subject)).size;
  const trainerCount = new Set(courses.map((course) => course.trainer)).size;
  const openSeats = courses.reduce((sum, course) => sum + course.seats, 0);

  const stats = [
    { label: "Courses", value: courses.length },
    { label: "Subjects", value: subjectCount },
    { label: "Trainers", value: trainerCount },
    { label: "Open seats", value: openSeats },
  ];

  // First 3 courses that still have seats
  const featuredCourses = courses.filter((course) => course.seats > 0).slice(0, 3);

  const steps = [
    {
      number: "1",
      title: "Browse courses",
      text: "Search by title or trainer, filter by subject, and sort by fee.",
    },
    {
      number: "2",
      title: "Build your plan",
      text: "Add courses to your study plan. We calculate the total fee and weekly hours.",
    },
    {
      number: "3",
      title: "Check your schedule",
      text: "We warn you if two courses use the same day and time, and show your budget balance.",
    },
  ];

  return (
    <div className="animate-fade-up space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 px-6 py-16 text-white md:px-12">
        {/* Decorative circles */}
        <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-white/5" />

        <div className="relative max-w-2xl">
          <span className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium">
            🎓 Training centre course planner
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-5xl">
            Plan your learning with confidence
          </h1>
          <p className="mt-4 text-lg text-blue-100">
            Choose the right courses, avoid time conflicts, and stay inside your budget, all in one
            place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/courses"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-lg hover:bg-blue-50"
            >
              Browse courses
            </Link>
            <Link
              to="/study-plan"
              className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              My study plan
              {planIds.length > 0 && (
                <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs text-blue-700">
                  {planIds.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="relative mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-3xl font-extrabold">{stat.value}</p>
              <p className="text-sm text-blue-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Subjects */}
      <section>
        <h2 className="text-2xl font-extrabold text-gray-900">Choose your subject</h2>
        <p className="mt-1 text-gray-600">Three areas to start your learning journey.</p>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {Object.keys(subjectStyles).map((key) => {
            const style = subjectStyles[key];
            const count = courses.filter((course) => course.subject === key).length;

            return (
              <Link
                key={key}
                to="/courses"
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${style.header} text-3xl`}
                >
                  {style.icon}
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">{style.label}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {count} {count === 1 ? "course" : "courses"} available
                </p>
                <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:underline">
                  View courses →
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured courses */}
      <section>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Featured courses</h2>
            <p className="mt-1 text-gray-600">Popular courses with seats available now.</p>
          </div>
          <Link to="/courses" className="text-sm font-semibold text-blue-600 hover:underline">
            See all →
          </Link>
        </div>

        {loading ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-80 animate-pulse rounded-2xl bg-gray-200" />
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        <h2 className="text-2xl font-extrabold text-gray-900">How it works</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                {step.number}
              </span>
              <h3 className="mt-4 font-bold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="rounded-3xl bg-gray-900 px-6 py-12 text-center text-white">
        <h2 className="text-2xl font-extrabold">Ready to build your study plan?</h2>
        <p className="mx-auto mt-2 max-w-md text-gray-400">
          Pick your courses and see your weekly timetable in a few clicks.
        </p>
        <Link
          to="/courses"
          className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Start now
        </Link>
      </section>
    </div>
  );
}

export default Home;