import { subjectStyles } from "../utils/subjectStyles";
import Icon from "./Icons";

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
    { value: "all", label: "All", iconName: "sparkles" },
    ...Object.keys(subjectStyles).map((key) => ({
      value: key,
      label: subjectStyles[key].label,
      iconName: subjectStyles[key].iconName,
    })),
  ];

  // True when any filter is changed
  const hasFilters = search !== "" || subject !== "all" || sort !== "none" || onlyAvailable;

  return (
    <div className="card-lux mb-10 p-5 sm:p-6">
      {/* Search + sort */}
      <div className="grid gap-3 md:grid-cols-3">
        <div className="relative md:col-span-2">
          <Icon
            name="search"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            placeholder="Search by course title or trainer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-lux pl-10"
          />
        </div>

        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-lux cursor-pointer">
          <option value="none">Sort by</option>
          <option value="low">Fee: low to high</option>
          <option value="high">Fee: high to low</option>
          <option value="hours">Weekly hours: low to high</option>
        </select>
      </div>

      {/* Subject buttons */}
      <div className="mt-5 flex flex-wrap gap-2">
        {subjectOptions.map((option) => {
          const active = subject === option.value;
          return (
            <button
              key={option.value}
              onClick={() => setSubject(option.value)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 active:scale-95 ${
                active
                  ? "border-ink bg-ink text-cream shadow-lg shadow-ink/20"
                  : "border-line bg-white text-muted hover:border-gold hover:text-ink"
              }`}
            >
              <Icon name={option.iconName} className={`h-4 w-4 ${active ? "text-gold-light" : ""}`} />
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Seats switch + result count + reset */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <button
          type="button"
          onClick={() => setOnlyAvailable(!onlyAvailable)}
          className="flex items-center gap-3 text-sm text-ink-soft"
        >
          <span
            className={`relative h-6 w-11 rounded-full transition-colors duration-500 ${
              onlyAvailable ? "bg-linear-to-r from-gold to-gold-dark" : "bg-[#d9d2c3]"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-500 ease-out ${
                onlyAvailable ? "left-5.5" : "left-0.5"
              }`}
            />
          </span>
          Only courses with available seats
        </button>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted">
            Showing <span className="font-semibold text-ink">{resultCount}</span> of {totalCount} courses
          </span>
          {hasFilters && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 font-medium text-gold-dark transition hover:text-ink"
            >
              <Icon name="x" className="h-3.5 w-3.5" />
              Reset filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseFilters;