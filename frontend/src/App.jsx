import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Messages from "./pages/Messages";
import Footer from "./components/Footer";
import Icon from "./components/Icons";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import StudyPlan from "./pages/StudyPlan";
import ManageCourses from "./pages/ManageCourses";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const API = `${(import.meta.env.VITE_API_URL || "").replace(/\/+$/, "")}/api`;
function App() {
  // All courses (loaded from the API)
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Read the saved plan from the browser when the app opens
  const [planIds, setPlanIds] = useState(() => {
    try {
      const saved = localStorage.getItem("planIds");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  // The login token is kept in the browser
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // Spending limit is kept here so it stays when we change pages
  const [budget, setBudget] = useState("");

  // Message shown to the user: { type: "error" | "success", text: "..." }
  const [message, setMessage] = useState(null);

  // Load courses from the JSON file when the app opens
  useEffect(() => {
    fetch(`${API}/courses`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed");
        }
        return response.json();
      })
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load courses. Please try again later.");
        setLoading(false);
      });
  }, []);

  // Hide the message automatically after 4 seconds
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  // Save the plan every time it changes
  useEffect(() => {
    localStorage.setItem("planIds", JSON.stringify(planIds));
  }, [planIds]);

  // Add a course to the study plan (the server does all the checks)
  const addToPlan = async (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    try {
      const response = await fetch(`${API}/plan/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planIds, courseId }),
      });
      const result = await response.json();

      if (!result.ok) {
        setMessage({ type: "error", text: result.error });
        return;
      }
    } catch {
      setMessage({ type: "error", text: "Cannot reach the server." });
      return;
    }

    setPlanIds((ids) => [...ids, courseId]);
    setMessage({
      type: "success",
      text: `"${course.title}" was added to your plan.`,
    });
  };

  // Remove a course from the study plan
  const removeFromPlan = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    setPlanIds(planIds.filter((id) => id !== courseId));
    if (course) {
      setMessage({
        type: "success",
        text: `"${course.title}" was removed from your plan.`,
      });
    }
  };

  // Create a new course or update an existing one (saved on the server)
  const saveCourse = async (course) => {
    const isEdit = Boolean(course.id);

    try {
      const response = await fetch(
        isEdit ? `${API}/courses/${course.id}` : `${API}/courses`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(course),
        },
      );
      const data = await response.json();
      if (response.status === 401) {
        logout();
        setMessage({
          type: "error",
          text: "Session expired. Please log in again.",
        });
        return;
      }

      if (!response.ok) {
        setMessage({ type: "error", text: data.error });
        return;
      }

      if (isEdit) {
        setCourses(courses.map((c) => (c.id === data.id ? data : c)));
        setMessage({ type: "success", text: `"${data.title}" was updated.` });
      } else {
        setCourses([...courses, data]);
        setMessage({ type: "success", text: `"${data.title}" was created.` });
      }
    } catch {
      setMessage({ type: "error", text: "Cannot reach the server." });
    }
  };

  // Delete a course (also remove it from the study plan)
  const deleteCourse = async (courseId) => {
    const course = courses.find((c) => c.id === courseId);

    try {
      const response = await fetch(`${API}/courses/${courseId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) {
        logout();
        setMessage({
          type: "error",
          text: "Session expired. Please log in again.",
        });
        return;
      }

      if (!response.ok) {
        setMessage({ type: "error", text: "Could not delete the course." });
        return;
      }

      setCourses(courses.filter((c) => c.id !== courseId));
      setPlanIds(planIds.filter((id) => id !== courseId));
      if (course) {
        setMessage({ type: "success", text: `"${course.title}" was deleted.` });
      }
    } catch {
      setMessage({ type: "error", text: "Cannot reach the server." });
    }
  };

  // Only count ids of courses that still exist
  const validPlanCount = planIds.filter((id) =>
    courses.some((c) => c.id === id),
  ).length;

  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink">
      <Navbar planCount={validPlanCount} token={token} onLogout={logout} />

      {/* Toast message (bottom of the screen) */}
      {message && (
        <div className="fixed inset-x-4 bottom-6 z-50 animate-toast-in sm:left-auto sm:right-6 sm:w-96">
          <div
            className={`relative overflow-hidden rounded-2xl border bg-white p-4 shadow-[0_24px_60px_-20px_rgba(20,24,31,0.45)] ${
              message.type === "error" ? "border-red-200" : "border-gold-light"
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white ${
                  message.type === "error"
                    ? "bg-linear-to-br from-red-500 to-red-700"
                    : "bg-linear-to-br from-emerald-soft to-emerald-deep"
                }`}
              >
                <Icon
                  name={message.type === "error" ? "alert" : "check"}
                  className="h-4 w-4"
                  strokeWidth={2.2}
                />
              </span>

              <div className="flex-1">
                <p
                  className={`text-xs font-semibold uppercase tracking-widest ${
                    message.type === "error" ? "text-red-600" : "text-gold-dark"
                  }`}
                >
                  {message.type === "error" ? "Attention" : "Success"}
                </p>
                <p className="mt-0.5 text-sm text-ink-soft">{message.text}</p>
              </div>

              <button
                onClick={() => setMessage(null)}
                aria-label="Close message"
                className="rounded-lg p-1 text-muted transition hover:bg-sand hover:text-ink"
              >
                <Icon name="x" className="h-4 w-4" />
              </button>
            </div>

            {/* Timer bar: shrinks over 4 seconds (same time as the auto hide) */}
            <div
              key={message.text}
              className={`absolute inset-x-0 bottom-0 h-0.5 origin-left animate-grow ${
                message.type === "error" ? "bg-red-400" : "bg-gold"
              }`}
              style={{
                animationDuration: "4s",
                animationTimingFunction: "linear",
                animationDirection: "reverse",
              }}
            />
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
        <Routes>
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route
            path="/"
            element={
              <Home
                courses={courses}
                loading={loading}
                planIds={planIds}
                onAdd={addToPlan}
                onRemove={removeFromPlan}
              />
            }
          />
          <Route
            path="/courses"
            element={
              <Courses
                courses={courses}
                loading={loading}
                error={error}
                planIds={planIds}
                onAdd={addToPlan}
                onRemove={removeFromPlan}
              />
            }
          />
          <Route
            path="/courses/:id"
            element={
              <CourseDetails
                courses={courses}
                loading={loading}
                planIds={planIds}
                onAdd={addToPlan}
                onRemove={removeFromPlan}
              />
            }
          />
          <Route
            path="/study-plan"
            element={
              <StudyPlan
                courses={courses}
                planIds={planIds}
                onRemove={removeFromPlan}
                budget={budget}
                setBudget={setBudget}
              />
            }
          />
          <Route
            path="/manage"
            element={
              <ProtectedRoute token={token}>
                <ManageCourses
                  courses={courses}
                  onSave={saveCourse}
                  onDelete={deleteCourse}
                />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route
            path="/messages"
            element={
              <ProtectedRoute token={token}>
                <Messages token={token} onUnauthorized={logout} />
              </ProtectedRoute>
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="*"
            element={
              <div className="animate-fade-up mx-auto max-w-md py-10 text-center">
                <p className="font-display text-8xl font-semibold text-gold-gradient">404</p>
                <span className="gold-rule mx-auto mt-4" />
                <h1 className="mt-6 text-2xl font-semibold text-ink">Page not found</h1>
                <p className="mt-2 text-sm text-muted">
                  The page you are looking for does not exist or was moved.
                </p>
                <Link to="/" className="btn-gold mt-8">
                  <Icon name="arrowLeft" className="h-4 w-4" />
                  Back to home
                </Link>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;