import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;
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
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Messages</h1>
        <p className="mt-2 text-gray-600">
          Messages sent from the Contact and Enquiry forms.
        </p>
      </div>

      {loading && (
        <div className="h-40 animate-pulse rounded-2xl bg-gray-200" />
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && messages.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-4xl">📭</p>
          <p className="mt-2 text-sm text-gray-500">No messages yet.</p>
        </div>
      )}

      <div className="space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold text-gray-900">{m.name}</p>
                <p className="text-sm text-gray-500">{m.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {m.topic}
                </span>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-3 text-gray-700">{m.message}</p>
            <p className="mt-3 text-xs text-gray-400">
              {new Date(m.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages;
