import { Link } from "react-router-dom";
import Logo from "./Logo";
import Icon from "./Icons";

function Footer() {
  // Quick links shown in the middle column
  const quickLinks = [
    { to: "/courses", label: "Courses" },
    { to: "/study-plan", label: "Study Plan" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  // Contact details shown in the last column
  const contactItems = [
    { icon: "mail", text: "info@skillhub.example" },
    { icon: "phone", text: "+93 700 000 000" },
    { icon: "mapPin", text: "Kabul, Afghanistan" },
  ];

  return (
    <footer className="relative mt-10 overflow-hidden bg-ink text-gray-300">
      {/* Gold line on top */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-gold to-transparent" />

      {/* Soft decorative glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-navy-soft/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        {/* About */}
        <div>
          <Logo variant="light" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-gray-400">
            Choose the right training courses, plan your week, and stay inside your budget.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="eyebrow">Quick links</h3>
          <span className="gold-rule mt-3" />
          <ul className="mt-5 space-y-3 text-sm">
            {quickLinks.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="group inline-flex items-center gap-2 text-gray-400 transition-colors duration-300 hover:text-gold-light"
                >
                  <Icon
                    name="arrowRight"
                    className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  />
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="eyebrow">Contact</h3>
          <span className="gold-rule mt-3" />
          <ul className="mt-5 space-y-4 text-sm text-gray-400">
            {contactItems.map((item) => (
              <li key={item.text} className="flex items-center gap-3">
                <span className="icon-badge-dark h-9 w-9">
                  <Icon name={item.icon} className="h-4 w-4" />
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10 py-5 text-center text-xs tracking-wide text-gray-500">
        © 2026 SkillHub Training Centre. Student project.
      </div>
    </footer>
  );
}

export default Footer;