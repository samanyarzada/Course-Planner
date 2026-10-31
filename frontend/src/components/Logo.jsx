import { useId } from "react";

// SkillHub logo: a light "S" monogram inside a green emblem + wordmark.
// variant="dark"  -> for light backgrounds (navbar)
// variant="light" -> for dark backgrounds (footer, hero)
function Logo({ size = 40, showText = true, variant = "dark" }) {
  // Unique id so two logos on the same page do not share gradients
  const uid = useId().replace(/:/g, "");

  const nameColor = variant === "light" ? "text-white" : "text-ink";
  const hubColor = variant === "light" ? "text-gold-light" : "text-gold-dark";
  const subColor = variant === "light" ? "text-gold-light" : "text-gold-dark";

  return (
    <span className="group inline-flex items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-700 ease-out group-hover:rotate-[8deg] group-hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0" style={{ stopColor: "var(--color-brand)" }} />
            <stop offset="1" style={{ stopColor: "var(--color-gold-dark)" }} />
          </linearGradient>
          <linearGradient id={`s-${uid}`} x1="10" y1="8" x2="30" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0" style={{ stopColor: "#ffffff" }} />
            <stop offset="1" style={{ stopColor: "var(--color-gold-light)" }} />
          </linearGradient>
        </defs>

        {/* Emblem */}
        <rect width="40" height="40" rx="11" fill={`url(#bg-${uid})`} />
        <rect
          x="1"
          y="1"
          width="38"
          height="38"
          rx="10"
          stroke="#ffffff"
          strokeOpacity="0.25"
          strokeWidth="1"
        />

        {/* Monogram S */}
        <path
          d="M25.5 13.2C24.3 11.7 22.4 10.9 20.2 10.9C16.9 10.9 14.7 12.6 14.7 15.1C14.7 20.4 25.8 18.1 25.8 24.6C25.8 27.4 23.4 29.2 20 29.2C17.5 29.2 15.4 28.2 14 26.4"
          stroke={`url(#s-${uid})`}
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* Small diamond detail */}
        <path d="M30.5 8.5L32 10.2L30.5 11.9L29 10.2Z" fill="#ffffff" fillOpacity="0.9" />
      </svg>

      {showText && (
        <span className="flex flex-col leading-none">
          <span className={`font-display text-xl font-semibold tracking-tight ${nameColor}`}>
            Skill<span className={`italic ${hubColor}`}>Hub</span>
          </span>
          <span className={`mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.28em] ${subColor}`}>
            Training Centre
          </span>
        </span>
      )}
    </span>
  );
}

export default Logo;