import { getSubjectStyle } from "../utils/subjectStyles";
import Icon from "./Icons";

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
    <div className="card-lux p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="icon-badge h-11 w-11">
            <Icon name="calendar" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Weekly timetable</h2>
            <p className="text-sm text-muted">A preview of your selected courses.</p>
          </div>
        </div>
        <span className="rounded-full border border-gold-light bg-cream px-4 py-1.5 text-sm font-semibold text-gold-dark">
          {entries.length} {entries.length === 1 ? "session" : "sessions"} per week
        </span>
      </div>

      {entries.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gold-light py-12 text-center">
          <span className="icon-badge mx-auto h-14 w-14">
            <Icon name="calendar" className="h-6 w-6" />
          </span>
          <p className="mt-3 text-sm text-muted">Add courses to see your weekly timetable.</p>
        </div>
      ) : (
        <div className="stagger mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {DAYS.map((day) => {
            // Only the entries of this day, sorted by hour
            const dayEntries = entries
              .filter((entry) => entry.day === day)
              .sort((a, b) => a.hour.localeCompare(b.hour));

            return (
              <div key={day} className="rounded-2xl border border-line bg-cream p-3">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-gold-dark">
                  {DAY_NAMES[day]}
                </p>
                <span className="mt-2 block h-px w-full bg-line" />

                {dayEntries.length === 0 ? (
                  <p className="mt-3 text-xs text-muted/70">Free day</p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {dayEntries.map((entry) => {
                      const style = getSubjectStyle(entry.subject);
                      return (
                        <div
                          key={entry.day + entry.hour + entry.title}
                          className={`rounded-xl bg-linear-to-br ${style.header} p-3 text-white shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md`}
                        >
                          <p className="flex items-center gap-1 text-xs font-semibold text-white/75">
                            <Icon name="clock" className="h-3 w-3" />
                            {entry.hour}:00
                          </p>
                          <p className="mt-1 text-sm font-semibold leading-tight">{entry.title}</p>
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