import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import StudyPlan from "./pages/StudyPlan";
import ManageCourses from "./pages/ManageCourses";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  // All courses (loaded from the API)
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // The study plan only stores course ids
  const [planIds, setPlanIds] = useState([]);

  // Spending limit is kept here so it stays when we change pages
  const [budget, setBudget] = useState("");

  // Message shown to the user: { type: "error" | "success", text: "..." }
  const [message, setMessage] = useState(null);

  // Load courses from the JSON file when the app opens
  useEffect(() => {
    fetch("/courses.json")
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

  // Add a course to the study plan (with all checks)
  const addToPlan = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    // Check 1: no duplicate courses
    if (planIds.includes(courseId)) {
      setMessage({
        type: "error",
        text: `"${course.title}" is already in your plan.`,
      });
      return;
    }

    // Check 2: the course must have available seats
    if (course.seats <= 0) {
      setMessage({
        type: "error",
        text: `"${course.title}" has no available seats.`,
      });
      return;
    }

    // Check 3: slot conflict with the courses already selected
    const selectedCourses = courses.filter((c) => planIds.includes(c.id));
    for (const other of selectedCourses) {
      const sharedSlot = course.slotIds.find((slot) =>
        other.slotIds.includes(slot),
      );
      if (sharedSlot) {
        setMessage({
          type: "error",
          text: `Conflict: "${course.title}" and "${other.title}" both use slot ${sharedSlot}. Remove "${other.title}" first.`,
        });
        return;
      }
    }

    setPlanIds([...planIds, courseId]);
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
  const saveCourse = (course) => {
    if (course.id) {
      // Edit: replace the old course with the new data
      setCourses(courses.map((c) => (c.id === course.id ? course : c)));
      setMessage({ type: "success", text: `"${course.title}" was updated.` });
    } else {
      // Create: give the new course the next free id
      const newId =
        courses.length > 0 ? Math.max(...courses.map((c) => c.id)) + 1 : 1;
      setCourses([...courses, { ...course, id: newId }]);
      setMessage({ type: "success", text: `"${course.title}" was created.` });
    }
  };

  // Delete a course (also remove it from the study plan)
  const deleteCourse = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    setCourses(courses.filter((c) => c.id !== courseId));
    setPlanIds(planIds.filter((id) => id !== courseId));
    if (course) {
      setMessage({ type: "success", text: `"${course.title}" was deleted.` });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-800">
      <Navbar planCount={planIds.length} />

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
              <ManageCourses
                courses={courses}
                onSave={saveCourse}
                onDelete={deleteCourse}
              />
            }
          />
          <Route path="/about" element={<About />} />
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
