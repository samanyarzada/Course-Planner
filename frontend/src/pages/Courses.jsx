import { useState } from "react";
import CourseCard from "../components/CourseCard";
import CourseFilters from "../components/CourseFilters";

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

  // Loading state: gray placeholder cards
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-80 animate-pulse rounded-2xl bg-gray-200" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
        {error}
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
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Explore courses</h1>
        <p className="mt-2 text-gray-600">
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
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-4xl">🔎</p>
          <h3 className="mt-3 text-lg font-semibold text-gray-900">No courses found</h3>
          <p className="mt-1 text-sm text-gray-500">Try a different search or change the filters.</p>
          <button
            onClick={resetFilters}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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