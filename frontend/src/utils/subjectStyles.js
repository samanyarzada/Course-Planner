// Colors and icons for each subject (used by cards, filters and timetable).
// "icon" (emoji) is kept for now so old components keep working.
// "iconName" is the new SVG icon name used by the upgraded components.
export const subjectStyles = {
  coding: {
    label: "Coding",
    icon: "💻",
    iconName: "code",
    header: "from-navy to-navy-soft",
    badge: "bg-navy/10 text-navy",
    text: "text-navy",
  },
  "office skills": {
    label: "Office skills",
    icon: "📊",
    iconName: "chart",
    header: "from-emerald-deep to-emerald-soft",
    badge: "bg-emerald-deep/10 text-emerald-deep",
    text: "text-emerald-deep",
  },
  design: {
    label: "Design",
    icon: "🎨",
    iconName: "palette",
    header: "from-wine to-wine-soft",
    badge: "bg-wine/10 text-wine",
    text: "text-wine",
  },
};

// Used when a subject is not in the list above
const defaultStyle = {
  label: "Course",
  icon: "📘",
  iconName: "book",
  header: "from-ink-soft to-muted",
  badge: "bg-ink/10 text-ink",
  text: "text-ink",
};

export function getSubjectStyle(subject) {
  return subjectStyles[subject] || defaultStyle;
}