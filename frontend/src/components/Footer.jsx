import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        {/* About */}
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-indigo-500 text-lg font-bold text-white">
              S
            </span>
            <span className="text-lg font-bold text-white">SkillHub</span>
          </div>
          <p className="mt-3 text-sm text-gray-400">
            Choose the right training courses, plan your week, and stay inside your budget.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-sm font-semibold text-white">Quick links</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/courses" className="hover:text-white">
                Courses
              </Link>
            </li>
            <li>
              <Link to="/study-plan" className="hover:text-white">
                Study Plan
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold text-white">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-400">
            <li>info@skillhub.example</li>
            <li>+93 700 000 000</li>
            <li>Kabul, Afghanistan</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © 2026 SkillHub Training Centre. Student project.
      </div>
    </footer>
  );
}

export default Footer;