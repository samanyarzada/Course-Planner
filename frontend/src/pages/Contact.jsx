import { useState } from "react";
import Icon from "../components/Icons";

const API_URL = `${(import.meta.env.VITE_API_URL || "").replace(/\/+$/, "")}/api`;

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", topic: "General question", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const contactInfo = [
    { icon: "mail", label: "Email", value: "info@skillhub.example" },
    { icon: "phone", label: "Phone", value: "+93 700 000 000" },
    { icon: "mapPin", label: "Address", value: "Kabul, Afghanistan" },
    { icon: "clock", label: "Office hours", value: "Saturday to Thursday, 8:00 to 16:00" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSent(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.includes("@")) newErrors.email = "Enter a valid email.";
    if (!form.message.trim()) newErrors.message = "Message is required.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        setErrors({ message: "Could not send the message. Try again." });
        return;
      }

      setSent(true);
      setForm({ name: "", email: "", topic: "General question", message: "" });
    } catch {
      setErrors({ message: "Cannot reach the server." });
    }
  };

  const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-muted";

  return (
    <div className="animate-fade-up">
      <div className="mb-10">
        <p className="eyebrow">Get in touch</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink md:text-5xl">Contact us</h1>
        <span className="gold-rule mt-4" />
        <p className="mt-4 max-w-2xl text-muted">
          Have a question about a course? We are happy to help.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Contact info */}
        <div className="stagger space-y-4 lg:col-span-2">
          {contactInfo.map((item) => (
            <div
              key={item.label}
              className="card-lux card-lux-hover group flex items-center gap-4 p-4"
            >
              <span className="icon-badge h-12 w-12 shrink-0">
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
                  {item.label}
                </p>
                <p className="mt-0.5 font-semibold text-ink">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card-lux space-y-5 p-7 lg:col-span-3">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                className="input-lux"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
                className="input-lux"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Topic</label>
            <select
              name="topic"
              value={form.topic}
              onChange={handleChange}
              className="input-lux cursor-pointer"
            >
              <option>General question</option>
              <option>Course information</option>
              <option>Fees and payment</option>
              <option>Schedule problem</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Message</label>
            <textarea
              name="message"
              rows="5"
              placeholder="Write your message here"
              value={form.message}
              onChange={handleChange}
              className="input-lux resize-none"
            />
            {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
          </div>

          <button type="submit" className="btn-gold px-8 py-3">
            <Icon name="send" className="h-4 w-4" />
            Send message
          </button>

          {sent && (
            <p className="animate-drop flex items-center gap-2 rounded-xl bg-emerald-deep/10 px-4 py-3 text-sm text-emerald-deep">
              <Icon name="checkCircle" className="h-4 w-4 shrink-0" />
              Thank you! Your message was received (sample only).
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Contact;