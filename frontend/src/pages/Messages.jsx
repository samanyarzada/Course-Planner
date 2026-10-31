import { useEffect, useState } from "react";
import Icon from "../components/Icons";

const API = `${(import.meta.env.VITE_API_URL || "").replace(/\/+$/, "")}/api`;
function Messages({ token, onUnauthorized }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load messages from the backend
  useEffect(() => {
    fetch(`${API}/messages`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        if (response.status === 401) {
          onUnauthorized();
          throw new Error("Unauthorized");
        }
        if (!response.ok) throw new Error("Request failed");
        return response.json();
      })
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load messages. Is the backend running?");
        setLoading(false);
      });
  }, [token, onUnauthorized]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      const response = await fetch(`${API}/messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setMessages(messages.filter((m) => m.id !== id));
      }
    } catch {
      setError("Cannot reach the server.");
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-10">
        <p className="eyebrow">Inbox</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink md:text-5xl">Messages</h1>
        <span className="gold-rule mt-4" />
        <p className="mt-4 max-w-2xl text-muted">
          Messages sent from the Contact and Enquiry forms.
        </p>
      </div>

      {loading && <div className="h-40 animate-pulse rounded-3xl bg-sand" />}

      {error && (
        <div className="animate-drop flex items-center justify-center gap-3 rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
          <Icon name="alert" className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {!loading && !error && messages.length === 0 && (
        <div className="rounded-3xl border border-dashed border-gold-light bg-white p-14 text-center">
          <span className="icon-badge mx-auto h-16 w-16">
            <Icon name="inbox" className="h-7 w-7" />
          </span>
          <p className="mt-4 text-sm text-muted">No messages yet.</p>
        </div>
      )}

      <div className="stagger space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="card-lux card-lux-hover group p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-gold-light to-gold font-display text-lg font-semibold text-ink">
                  {m.name.charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="font-semibold text-ink">{m.name}</p>
                  <p className="text-sm text-muted">{m.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-gold-light bg-cream px-3 py-1 text-xs font-medium text-gold-dark">
                  {m.topic}
                </span>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition-all duration-300 hover:bg-red-100 active:scale-95"
                >
                  <Icon name="trash" className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-4 leading-relaxed text-ink-soft">{m.message}</p>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
              <Icon name="clock" className="h-3.5 w-3.5" />
              {new Date(m.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages;