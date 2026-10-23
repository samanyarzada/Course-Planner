import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar({ planCount }) {
  // Controls the mobile menu (open or closed)
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/courses", label: "Courses" },
    { to: "/study-plan", label: "Study Plan" },
    { to: "/manage", label: "Manage Courses" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  // NavLink gives us isActive, so we can style the current page
  const linkClass = ({ isActive }) =>
    `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-md shadow-blue-600/30">
            S
          </span>
          <span className="text-lg font-bold text-gray-900">
            Skill<span className="text-blue-600">Hub</span>
          </span>
        </Link>

        {/* Menu button (only on small screens) */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 md:hidden"
        >
          {open ? "✕ Close" : "☰ Menu"}
        </button>

        {/* Links */}
        <ul
          className={`${
            open ? "flex" : "hidden"
          } w-full flex-col gap-1 pt-3 md:flex md:w-auto md:flex-row md:items-center md:pt-0`}
        >
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                {link.label}
                {/* Number of courses in the plan */}
                {link.to === "/study-plan" && (
                  <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white">
                    {planCount}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;