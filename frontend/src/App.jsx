import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Messages from "./pages/Messages";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import StudyPlan from "./pages/StudyPlan";
import ManageCourses from "./pages/ManageCourses";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const API = import.meta.env.VITE_API_URL;
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

  // Create a new course or update an existing one
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
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-800">
      <Navbar planCount={validPlanCount} token={token} onLogout={logout} />

      {/* Toast message (bottom of the screen) */}
      {message && (
        <div className="fixed inset-x-4 bottom-6 z-50 animate-fade-up sm:left-auto sm:right-6 sm:w-96">
          <div
            className={`flex items-start gap-3 rounded-xl border p-4 text-sm shadow-lg ${
              message.type === "error"
                ? "border-red-200 bg-white text-red-700"
                : "border-green-200 bg-white text-green-700"
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                message.type === "error" ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {message.type === "error" ? "!" : "✓"}
            </span>
            <p className="flex-1 text-gray-700">{message.text}</p>
            <button
              onClick={() => setMessage(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
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
              <p className="text-center text-gray-600">Page not found.</p>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
