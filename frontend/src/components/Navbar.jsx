import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import Icon from "./Icons";

function Navbar({ planCount, token, onLogout }) {
  // Controls the mobile menu (open or closed)
  const [open, setOpen] = useState(false);
  // True after the page is scrolled a little (adds a soft shadow)
  const [scrolled, setScrolled] = useState(false);

  // Listen to scroll to change the navbar style
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
   window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/courses", label: "Courses" },
    { to: "/study-plan", label: "Study Plan" },
    // Admin links only appear after login
    ...(token
      ? [
          { to: "/manage", label: "Manage Courses" },
          { to: "/messages", label: "Messages" },
        ]
      : []),
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  // NavLink gives us isActive, so we can style the current page
  const linkClass = ({ isActive }) =>
    `group relative flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${
      isActive ? "text-ink" : "text-muted hover:text-ink"
    }`;

  return (
    <header
      className={`glass sticky top-0 z-30 border-b transition-all duration-500 ${
        scrolled
          ? "border-line shadow-[0_10px_30px_-20px_rgba(20,24,31,0.35)]"
          : "border-transparent"
      }`}
    >
      {/* Thin gold line at the very top */}
      <div className="h-0.5 w-full bg-linear-to-r from-transparent via-gold to-transparent opacity-70" />

      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" onClick={() => setOpen(false)} aria-label="SkillHub home">
          <Logo />
        </Link>

        {/* Menu button (only on small screens) */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-ink transition hover:border-gold hover:text-gold-dark active:scale-95 md:hidden"
        >
          <Icon name={open ? "x" : "menu"} className="h-5 w-5" />
        </button>

        {/* Links (smooth open and close on mobile) */}
        <div
          className={`grid w-full transition-all duration-500 ease-out md:block md:w-auto md:opacity-100 ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0 overflow-hidden md:overflow-visible">
            <ul className="flex flex-col gap-1 pt-3 md:flex-row md:items-center md:gap-1 md:pt-0">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    onClick={() => setOpen(false)}
                    className={linkClass}
                  >
                    {({ isActive }) => (
                      <>
                        {link.label}

                        {/* Number of courses in the plan */}
                        {link.to === "/study-plan" && (
                          <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-linear-to-br from-gold-light to-gold px-1.5 text-[0.7rem] font-bold text-ink shadow-sm">
                            {planCount}
                          </span>
                        )}

                        {/* Gold underline: slides in on hover, stays on the active page */}
                        <span
                          className={`absolute inset-x-3 bottom-0.5 h-0.5 origin-left rounded-full bg-gold transition-transform duration-500 ease-out ${
                            isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                          }`}
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}

              <li className="pt-2 md:pl-3 md:pt-0">
                {token ? (
                  <button
                    onClick={() => {
                      onLogout();
                      setOpen(false);
                    }}
                    className="btn-outline w-full md:w-auto"
                  >
                    <Icon name="logout" className="h-4 w-4" />
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="btn-ink w-full md:w-auto"
                  >
                    <Icon name="lock" className="h-4 w-4" />
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;