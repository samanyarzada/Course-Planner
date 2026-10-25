import { getSubjectStyle } from "../utils/subjectStyles";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];

// Full day names (shown on bigger screens)
const DAY_NAMES = {
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
};

// Shows the weekly timetable of the selected courses
function TimetableSummary({ courses }) {
  // Turn every slot (like "MON-09") into a small object
  const entries = [];
  courses.forEach((course) => {
    course.slotIds.forEach((slot) => {
      const [day, hour] = slot.split("-");
      entries.push({ day, hour, title: course.title, subject: course.subject });
    });
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Weekly timetable</h2>
          <p className="text-sm text-gray-500">A preview of your selected courses.</p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
          {entries.length} {entries.length === 1 ? "session" : "sessions"} per week
        </span>
      </div>

      {entries.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-gray-300 py-10 text-center">
          <p className="text-3xl">🗓️</p>
          <p className="mt-2 text-sm text-gray-500">Add courses to see your weekly timetable.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {DAYS.map((day) => {
            // Only the entries of this day, sorted by hour
            const dayEntries = entries
              .filter((entry) => entry.day === day)
              .sort((a, b) => a.hour.localeCompare(b.hour));

            return (
              <div key={day} className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                  {DAY_NAMES[day]}
                </p>

                {dayEntries.length === 0 ? (
                  <p className="mt-3 text-xs text-gray-400">Free day</p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {dayEntries.map((entry) => {
                      const style = getSubjectStyle(entry.subject);
                      return (
                        <div
                          key={entry.day + entry.hour + entry.title}
                          className={`rounded-lg bg-linear-to-br ${style.header} p-2.5 text-white shadow-sm`}
                        >
                          <p className="text-xs font-semibold text-white/80">{entry.hour}:00</p>
                          <p className="text-sm font-bold leading-tight">{entry.title}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TimetableSummary;