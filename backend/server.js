import express from "express";
import cors from "cors";
import fs from "fs";
import jwt from "jsonwebtoken";

const app = express();

app.use(cors()); // اجازه به فرانت‌اند
app.use(express.json()); // فهمیدن JSON در درخواست‌ها

// ---------- Login ----------
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ error: "Wrong username or password." });
  }

  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
  res.json({ token });
});

// Middleware: lets the request pass only if it has a valid token
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: "Login required." });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Session expired. Please log in again." });
  }
}

const COURSES_FILE = "./data/courses.json";
const MESSAGES_FILE = "./data/messages.json";

// ---------- توابع کمکی برای خواندن و نوشتن فایل ----------
function readJson(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ---------- چک کردن اطلاعات دوره ----------
const SLOT_PATTERN = /^(MON|TUE|WED|THU|FRI|SAT)-\d{2}$/;

const SUBJECTS = ["coding", "office skills", "design"];

function validateCourse(c) {
  if (!c.title || !c.title.trim()) return "Title is required.";
  if (!c.trainer || !c.trainer.trim()) return "Trainer is required.";
  if (!(Number(c.feeAFN) > 0)) return "Fee must be a positive number.";
  if (!(Number(c.weeklyHours) > 0))
    return "Weekly hours must be a positive number.";
  if (!Number.isInteger(Number(c.seats)) || Number(c.seats) < 0)
    return "Seats must be a whole number.";
  if (!Array.isArray(c.slotIds) || c.slotIds.length === 0)
    return "Add at least one slot.";
  if (c.slotIds.some((s) => !SLOT_PATTERN.test(s)))
    return "Slot format must be like MON-09.";
  if (!c.description || !c.description.trim())
    return "Description is required.";
  if (!SUBJECTS.includes(c.subject)) return "Subject is not valid.";
  if (c.slotIds.some((s) => Number(s.split("-")[1]) > 23))
    return "Slot hour must be between 00 and 23.";
  return null; // یعنی مشکلی نیست
}
// Build a clean course object (only the allowed fields)
function buildCourse(body, id) {
  return {
    id,
    title: body.title.trim(),
    subject: body.subject,
    trainer: body.trainer.trim(),
    feeAFN: Number(body.feeAFN),
    weeklyHours: Number(body.weeklyHours),
    seats: Number(body.seats),
    slotIds: [...new Set(body.slotIds)],
    description: body.description.trim(),
  };
}

// ---------- تست سرور ----------
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ---------- دوره‌ها ----------

// لیست همه دوره‌ها
app.get("/api/courses", (req, res) => {
  res.json(readJson(COURSES_FILE));
});

// یک دوره
app.get("/api/courses/:id", (req, res) => {
  const courses = readJson(COURSES_FILE);
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return res.status(404).json({ error: "Course not found." });
  res.json(course);
});

// ساخت دوره جدید
app.post("/api/courses", requireAdmin, (req, res) => {
  const error = validateCourse(req.body);
  if (error) return res.status(400).json({ error });

  const courses = readJson(COURSES_FILE);
  const newId =
    courses.length > 0 ? Math.max(...courses.map((c) => c.id)) + 1 : 1;

  const course = buildCourse(req.body, newId);

  courses.push(course);
  writeJson(COURSES_FILE, courses);
  res.status(201).json(course);
});

// ویرایش دوره
app.put("/api/courses/:id", requireAdmin, (req, res) => {
  const error = validateCourse(req.body);
  if (error) return res.status(400).json({ error });

  const courses = readJson(COURSES_FILE);
  const index = courses.findIndex((c) => c.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Course not found." });

  const updated = buildCourse(req.body, courses[index].id);

  courses[index] = updated;
  writeJson(COURSES_FILE, courses);
  res.json(updated);
});

// حذف دوره
app.delete("/api/courses/:id", requireAdmin, (req, res) => {
  const courses = readJson(COURSES_FILE);
  const exists = courses.some((c) => c.id === Number(req.params.id));
  if (!exists) return res.status(404).json({ error: "Course not found." });

  writeJson(
    COURSES_FILE,
    courses.filter((c) => c.id !== Number(req.params.id)),
  );
  res.json({ success: true });
});

// ---------- پیام‌ها (Contact و Enquiry) ----------
app.post("/api/messages", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !name.trim())
    return res.status(400).json({ error: "Name is required." });
  if (!email || !email.includes("@"))
    return res.status(400).json({ error: "Enter a valid email." });
  if (!message || !message.trim())
    return res.status(400).json({ error: "Message is required." });

  const messages = readJson(MESSAGES_FILE);
  messages.push({
    id: Date.now(),
    name: name.trim(),
    email: email.trim(),
    topic: req.body.topic || "General question",
    message: message.trim(),
    createdAt: new Date().toISOString(),
  });
  writeJson(MESSAGES_FILE, messages);

  res.status(201).json({ success: true });
});
// List all messages (newest first)
app.get("/api/messages", requireAdmin, (req, res) => {
  const messages = readJson(MESSAGES_FILE);
  res.json([...messages].reverse());
});

// Delete one message
app.delete("/api/messages/:id", requireAdmin, (req, res) => {
  const messages = readJson(MESSAGES_FILE);
  const exists = messages.some((m) => m.id === Number(req.params.id));
  if (!exists) return res.status(404).json({ error: "Message not found." });

  writeJson(
    MESSAGES_FILE,
    messages.filter((m) => m.id !== Number(req.params.id)),
  );
  res.json({ success: true });
});

// ---------- Check before adding a course to a plan ----------
app.post("/api/plan/check", (req, res) => {
  const { planIds, courseId } = req.body;

  if (!Array.isArray(planIds) || !Number.isInteger(courseId)) {
    return res.status(400).json({ ok: false, error: "Invalid request." });
  }

  const courses = readJson(COURSES_FILE);
  const course = courses.find((c) => c.id === courseId);
  if (!course)
    return res.status(404).json({ ok: false, error: "Course not found." });

  if (planIds.includes(courseId)) {
    return res.json({
      ok: false,
      error: `"${course.title}" is already in your plan.`,
    });
  }

  if (course.seats <= 0) {
    return res.json({
      ok: false,
      error: `"${course.title}" has no available seats.`,
    });
  }

  const selected = courses.filter((c) => planIds.includes(c.id));
  for (const other of selected) {
    const sharedSlot = course.slotIds.find((slot) =>
      other.slotIds.includes(slot),
    );
    if (sharedSlot) {
      return res.json({
        ok: false,
        error: `Conflict: "${course.title}" and "${other.title}" both use slot ${sharedSlot}. Remove "${other.title}" first.`,
      });
    }
  }

  res.json({ ok: true });
});

// ---------- روشن کردن سرور ----------
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
