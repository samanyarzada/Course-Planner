import { useState } from "react";
import CourseCard from "../components/CourseCard";
import CourseFilters from "../components/CourseFilters";
import Icon from "../components/Icons";

function Courses({ courses, loading, error, planIds, onAdd, onRemove }) {
  // Filter states
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("all");
  const [sort, setSort] = useState("none");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Put all filters back to the start values
  const resetFilters = () => {
    setSearch("");
    setSubject("all");
    setSort("none");
    setOnlyAvailable(false);
  };

  // Loading state: soft placeholder cards
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-96 animate-pulse rounded-3xl bg-sand" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-up mx-auto max-w-lg rounded-3xl border border-red-200 bg-red-50 p-10 text-center text-red-700">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm">
          <Icon name="alert" className="h-6 w-6" />
        </span>
        <p className="mt-4 text-sm font-medium">{error}</p>
      </div>
    );
  }

  // Search + subject + seats filters
  let visibleCourses = courses.filter((course) => {
    const text = search.toLowerCase();
    const matchesSearch =
      course.title.toLowerCase().includes(text) || course.trainer.toLowerCase().includes(text);
    const matchesSubject = subject === "all" || course.subject === subject;
    const matchesSeats = !onlyAvailable || course.seats > 0;
    return matchesSearch && matchesSubject && matchesSeats;
  });

  // Sort (copy the array first so we do not change the original)
  if (sort === "low") {
    visibleCourses = [...visibleCourses].sort((a, b) => a.feeAFN - b.feeAFN);
  } else if (sort === "high") {
    visibleCourses = [...visibleCourses].sort((a, b) => b.feeAFN - a.feeAFN);
  } else if (sort === "hours") {
    visibleCourses = [...visibleCourses].sort((a, b) => a.weeklyHours - b.weeklyHours);
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-10">
        <p className="eyebrow">Our catalogue</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink md:text-5xl">Explore courses</h1>
        <span className="gold-rule mt-4" />
        <p className="mt-4 max-w-2xl text-muted">
          Find the right course, check the schedule, and add it to your study plan.
        </p>
      </div>

      <CourseFilters
        search={search}
        setSearch={setSearch}
        subject={subject}
        setSubject={setSubject}
        sort={sort}
        setSort={setSort}
        onlyAvailable={onlyAvailable}
        setOnlyAvailable={setOnlyAvailable}
        resultCount={visibleCourses.length}
        totalCount={courses.length}
        onReset={resetFilters}
      />

      {visibleCourses.length === 0 ? (
        <div className="animate-fade-up rounded-3xl border border-dashed border-gold-light bg-white p-14 text-center">
          <span className="icon-badge mx-auto h-16 w-16">
            <Icon name="search" className="h-7 w-7" />
          </span>
          <h3 className="mt-5 font-display text-xl font-semibold text-ink">No courses found</h3>
          <p className="mt-1 text-sm text-muted">Try a different search or change the filters.</p>
          <button onClick={resetFilters} className="btn-gold mt-6">
            Reset filters
          </button>
        </div>
      ) : (
        <div className="stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCourses.map((course) => (
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
    </div>
  );
}

export default Courses;