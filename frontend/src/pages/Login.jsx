import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Icon from "../components/Icons";

const API = `${(import.meta.env.VITE_API_URL || "").replace(/\/+$/, "")}/api`;
function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      onLogin(data.token);
      navigate("/manage");
    } catch {
      setError("Cannot reach the server.");
    }
  };

  const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-muted";

  return (
    <div className="animate-fade-up mx-auto max-w-md py-6">
      <form onSubmit={handleSubmit} className="card-lux relative space-y-5 overflow-hidden p-8">
        {/* Gold line on top of the card */}
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-gold-light via-gold to-gold-dark" />

        <div className="flex flex-col items-center text-center">
          <Logo size={52} showText={false} />
          <h1 className="mt-5 text-3xl font-semibold text-ink">Admin login</h1>
          <span className="gold-rule mt-3" />
          <p className="mt-3 text-sm text-muted">Only the admin can manage courses and messages.</p>
        </div>

        <div>
          <label className={labelClass}>Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="input-lux"
          />
        </div>

        <div>
          <label className={labelClass}>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="input-lux"
          />
        </div>

        {error && (
          <p className="animate-drop flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700">
            <Icon name="alert" className="h-4 w-4 shrink-0" />
            {error}
          </p>
        )}

        <button type="submit" className="btn-gold w-full py-3.5">
          <Icon name="lock" className="h-4 w-4" />
          Log in
        </button>
      </form>
    </div>
  );
}

export default Login;