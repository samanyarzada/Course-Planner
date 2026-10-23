import { subjectStyles } from "../utils/subjectStyles";

// Controlled inputs: the values live in the parent, we only show them here
function CourseFilters({
  search,
  setSearch,
  subject,
  setSubject,
  sort,
  setSort,
  onlyAvailable,
  setOnlyAvailable,
  resultCount,
  totalCount,
  onReset,
}) {
  // Quick subject buttons
  const subjectOptions = [
    { value: "all", label: "All", icon: "✨" },
    ...Object.keys(subjectStyles).map((key) => ({
      value: key,
      label: subjectStyles[key].label,
      icon: subjectStyles[key].icon,
    })),
  ];

  // True when any filter is changed
  const hasFilters = search !== "" || subject !== "all" || sort !== "none" || onlyAvailable;

  return (
    <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* Search + sort */}
      <div className="grid gap-3 md:grid-cols-3">
        <div className="relative md:col-span-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search by course title or trainer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          <option value="none">Sort by</option>
          <option value="low">Fee: low to high</option>
          <option value="high">Fee: high to low</option>
          <option value="hours">Weekly hours: low to high</option>
        </select>
      </div>

      {/* Subject buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        {subjectOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSubject(option.value)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              subject === option.value
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="mr-1">{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>

      {/* Seats switch + result count + reset */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => setOnlyAvailable(!onlyAvailable)}
          className="flex items-center gap-3 text-sm text-gray-700"
        >
          <span
            className={`relative h-6 w-11 rounded-full transition ${
              onlyAvailable ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                onlyAvailable ? "left-5.5" : "left-0.5"
              }`}
            />
          </span>
          Only courses with available seats
        </button>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500">
            Showing <span className="font-semibold text-gray-900">{resultCount}</span> of {totalCount}{" "}
            courses
          </span>
          {hasFilters && (
            <button onClick={onReset} className="font-medium text-blue-600 hover:underline">
              Reset filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseFilters;