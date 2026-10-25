// Colors and icons for each subject (used by cards and filters)
export const subjectStyles = {
  coding: {
    label: "Coding",
    icon: "💻",
    header: "from-blue-500 to-indigo-600",
    badge: "bg-blue-50 text-blue-700",
  },
  "office skills": {
    label: "Office skills",
    icon: "📊",
    header: "from-emerald-500 to-teal-600",
    badge: "bg-emerald-50 text-emerald-700",
  },
  design: {
    label: "Design",
    icon: "🎨",
    header: "from-fuchsia-500 to-purple-600",
    badge: "bg-purple-50 text-purple-700",
  },
};

// Used when a subject is not in the list above
const defaultStyle = {
  label: "Course",
  icon: "📘",
  header: "from-gray-500 to-gray-700",
  badge: "bg-gray-100 text-gray-700",
};

export function getSubjectStyle(subject) {
  return subjectStyles[subject] || defaultStyle;
}