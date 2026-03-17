import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { MessageCircle, X, Send, Image, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import PetService from "../services/PetService";
import UserService from "../services/UserService";
import api from "../services/Apiservices";

// ── IMAGE SLIDER ───────────────────────────────────────────────────────────
function PetImageSlider({ images = [], petName }) {
  const [current, setCurrent] = useState(0);
  const sorted = [...images].sort((a, b) => a.display_order - b.display_order);
  const total = sorted.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  if (total === 0) {
    return (
      <div className="w-full h-80 bg-gray-100 rounded-2xl flex items-center justify-center">
        <p className="text-gray-400 text-sm">No photos available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main image */}
      <div className="relative w-full h-80 rounded-2xl overflow-hidden">
        <img
          src={sorted[current].file_url}
          alt={`${petName} photo ${current + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Prev / Next buttons — only show if more than 1 image */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition-colors"
            >
              <ChevronLeft size={18} className="text-gray-700" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition-colors"
            >
              <ChevronRight size={18} className="text-gray-700" />
            </button>
          </>
        )}

        {/* Counter badge */}
        {total > 1 && (
          <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
            {current + 1} / {total}
          </span>
        )}

        {/* Favourite button */}
        <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow text-gray-400 hover:text-red-500 transition-colors">
          ♥
        </button>
      </div>

      {/* Thumbnail strip */}
      {total > 1 && (
        <div className="flex gap-2 mt-2">
          {sorted.map((img, index) => (
            <button
              key={img.id}
              onClick={() => setCurrent(index)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors shrink-0 ${
                index === current
                  ? "border-blue-500"
                  : "border-transparent hover:border-blue-300"
              }`}
            >
              <img
                src={img.file_url}
                alt={`${petName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── CHAT POPUP ─────────────────────────────────────────────────────────────
function ChatPopup({ pet, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const currentUser = UserService.getCurrentUser();

  useEffect(() => {
    initChat();
    return () => { if (socketRef.current) socketRef.current.disconnect(); };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initChat = async () => {
    try {
      // Step 1 — get or create conversation
      const res = await api.post("/conversations", { pet_id: pet.id });
      const convId = res.data.data.id;
      setConversationId(convId);

      // Step 2 — connect socket FIRST
      const token = localStorage.getItem("accessToken");
      const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
        query: { token },
        transports: ["websocket", "polling"],
      });

      socketRef.current = socket;

      socket.on("connect", async () => {
        // Step 3 — join room
        socket.emit("join_conversation", convId);

        // Step 4 — load history AFTER joining
        const historyRes = await api.get(`/conversations/${convId}/messages`);
        setMessages(historyRes.data.data);
        setLoading(false);
      });

      // Step 5 — listen for new messages
      socket.on("new_message", (msg) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      });

      socket.on("connect_error", (err) => {
        console.error("Socket error:", err.message);
        setLoading(false);
      });
    } catch (err) {
      console.error("Chat init error:", err);
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !conversationId || sending) return;
    setSending(true);
    const content = input.trim();
    setInput("");

    socketRef.current?.emit("send_message", {
      conversation_id: conversationId,
      content,
    });

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        conversation_id: conversationId,
        sender_id: currentUser.id,
        content,
        file_url: null,
        createdAt: new Date().toISOString(),
        sender: {
          id: currentUser.id,
          first_name: currentUser.first_name || "You",
          role: currentUser.role,
        },
      },
    ]);
    setSending(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !conversationId) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post(`/conversations/${conversationId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      socketRef.current?.emit("send_message", {
        conversation_id: conversationId,
        content: "",
        file_url: res.data.file_url,
        file_type: res.data.file_type,
      });
    } catch (err) {
      console.error("Image upload error:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isMe = (msg) => msg.sender_id === currentUser?.id || msg.sender?.id === currentUser?.id;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
      style={{ height: "460px" }}
    >
      <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
            {pet.name?.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold">{pet.name}</p>
            <p className="text-xs text-blue-100">
              {pet.shelter?.name || "Shelter"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 rounded-full p-1 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="bg-amber-50 border-b border-amber-100 px-3 py-2">
        <p className="text-xs text-amber-700">
          🔒 You're chatting anonymously. Your identity is revealed only after applying.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <Loader2 size={20} className="animate-spin text-gray-300" />
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-3xl mb-2">🐾</div>
              <p className="text-xs text-gray-400">
                Say hello to ask about {pet.name}!
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${isMe(msg) ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-3 py-2 ${
                isMe(msg)
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}
            >
              {msg.file_url ? (
                <img
                  src={msg.file_url}
                  alt="attachment"
                  className="rounded-lg max-w-full max-h-40 object-cover"
                />
              ) : (
                <p className="text-sm leading-relaxed">{msg.content}</p>
              )}
              <p
                className={`text-[10px] mt-1 ${
                  isMe(msg) ? "text-blue-200" : "text-gray-400"
                }`}
              >
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-100 px-3 py-2 flex items-center gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingImage}
          className="text-gray-400 hover:text-blue-500 transition-colors shrink-0"
        >
          {uploadingImage ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Image size={18} />
          )}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 text-sm bg-gray-50 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || sending}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors disabled:opacity-40 shrink-0"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}

// ── MAIN PAGE ──────────────────────────────────────────────────────────────
const PetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  const handleAdopt = () => {
    if (!UserService.isAuthenticated()) {
      navigate("/login", { state: { from: `/pets/${id}` } });
      return;
    }
    navigate(`/pets/${id}/apply`);
  };

  const handleChat = () => {
    if (!UserService.isAuthenticated()) {
      navigate("/login", { state: { from: `/pets/${id}` } });
      return;
    }
    const currentUser = UserService.getCurrentUser();
    if (currentUser?.role === "shelter" || currentUser?.role === "admin") {
      alert("Shelter accounts cannot send adoption inquiries.");
      return;
    }
    setChatOpen(true);
  };

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const result = await PetService.getPetById(id);
        setPet(result.data);
      } catch {
        setError("Failed to load pet details.");
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🐾</div>
          <p className="text-gray-500 text-sm">Loading pet details...</p>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-sm mb-4">{error || "Pet not found"}</p>
          <button
            onClick={() => navigate("/browse")}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/browse")}
          className="text-sm text-gray-500 hover:text-blue-600 mb-6 flex items-center gap-1"
        >
          ← Back to Browse
        </button>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* LEFT — Image Slider */}
            <div className="w-full md:w-80 shrink-0">
              <PetImageSlider images={pet.images} petName={pet.name} />

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Shelter & Adoption
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                    {pet.shelter?.name?.charAt(0) || "S"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {pet.shelter?.name || "Unknown Shelter"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {pet.shelter?.city}, {pet.shelter?.state}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    Adoption Fee
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pet.adoption_fee ? `₹${pet.adoption_fee}` : "Free"}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT — Pet Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                  {pet.gender?.charAt(0).toUpperCase() + pet.gender?.slice(1)}
                </span>
              </div>

              <p className="text-gray-500 text-sm mb-6">
                {pet.breed} • {pet.age} {pet.age === 1 ? "Year" : "Years"} Old
              </p>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Quick Facts
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Temperament", value: pet.temperament },
                    {
                      label: "Vaccinated",
                      value: pet.vaccinated ? "Yes, Up-to-date" : "No",
                    },
                    {
                      label: "Sterilized",
                      value: pet.sterilized?.replace("_", " "),
                    },
                    { label: "Health Record", value: pet.health_status },
                    {
                      label: "Good with Kids",
                      value:
                        pet.good_with_kids === true
                          ? "Yes"
                          : pet.good_with_kids === false
                          ? "No"
                          : "—",
                    },
                    {
                      label: "Special Needs",
                      value: pet.special_needs ? "Yes" : "No",
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                        {label}
                      </p>
                      <p className="text-sm font-medium text-gray-800 capitalize">
                        {value || "—"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {pet.rescue_story && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Rescue Story
                  </h3>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-gray-700 leading-relaxed italic">
                      "{pet.rescue_story}"
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleAdopt}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm"
                >
                  Apply for Adoption →
                </button>
                <button
                  onClick={handleChat}
                  className="flex items-center gap-2 px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors text-sm"
                >
                  <MessageCircle size={16} />
                  Ask
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {chatOpen && (
        <ChatPopup pet={pet} onClose={() => setChatOpen(false)} />
      )}
    </div>
  );
};

export default PetDetailPage;