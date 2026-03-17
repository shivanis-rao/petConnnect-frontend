import { useState, useEffect, useRef } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
  Plus, List, Heart, MessageSquare, BarChart2,
  LogOut, Send, Image, Loader2, PawPrint, Search
} from 'lucide-react';
import api from '../services/Apiservices';
import UserService from '../services/UserService';

// ── SIDEBAR ────────────────────────────────────────────────────────────────
const navItems = [
  { label: 'Adoption Requests', icon: Heart, to: '/shelter/adoptions' },
  { label: 'Your Pet Listings', icon: List, to: '/shelter/pets' },
  { label: 'Messages', icon: MessageSquare, to: '/shelter/messages' },
  { label: 'Analytics', icon: BarChart2, to: '/shelter/analytics' },
];

function Sidebar() {
  const navigate = useNavigate();
  return (
    <aside className="w-52 min-h-screen bg-white flex flex-col border-r border-gray-100 shrink-0">
      <div className="px-5 pt-6 pb-5">
        <button
          onClick={() => navigate('/shelter/pets/add')}
          className="w-full flex items-center justify-center gap-2 bg-[#3182CE] hover:bg-[#2b6cb0] transition-colors text-white text-sm font-medium py-2 px-4 rounded-md"
        >
          <Plus size={15} />
          Add Pet
        </button>
      </div>
      <nav className="flex-1 px-3">
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md mb-0.5 text-sm transition-colors ${
                isActive
                  ? 'bg-blue-50 text-[#3182CE] font-medium'
                  : 'text-gray-500 hover:text-[#3182CE] hover:bg-blue-50'
              }`
            }
          >
            <Icon size={15} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-3 pb-6">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

// ── STATUS BADGE ───────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const styles = {
    Inquiry: 'bg-gray-100 text-gray-500',
    Applied: 'bg-blue-100 text-blue-600',
    Closed: 'bg-red-100 text-red-500',
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${styles[status] || styles.Inquiry}`}>
      {status}
    </span>
  );
}

// ── CONVERSATION ITEM ──────────────────────────────────────────────────────
function ConversationItem({ conv, isActive, onClick }) {
  const lastMsg = conv.messages?.[0];
  const unread = conv.shelter_unread || 0;
  const adopterName = conv.is_anonymous
    ? 'Anonymous'
    : `${conv.adopter?.first_name || ''} ${conv.adopter?.last_name || ''}`.trim();

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
        isActive ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm shrink-0">
          {adopterName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <p className="text-xs font-semibold text-gray-800 truncate">{adopterName}</p>
            <div className="flex items-center gap-1 shrink-0">
              {unread > 0 && (
                <span className="w-4 h-4 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unread}
                </span>
              )}
            </div>
          </div>
          <p className="text-[11px] text-blue-500 font-medium truncate mb-1">
            🐾 {conv.pet?.name || 'Unknown Pet'}
          </p>
          <p className="text-[11px] text-gray-400 truncate">
            {lastMsg?.content || 'No messages yet'}
          </p>
        </div>
      </div>
    </button>
  );
}

// ── CHAT WINDOW ────────────────────────────────────────────────────────────
function ChatWindow({ conv, currentUser, socketRef }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!conv) return;
    loadMessages();
  }, [conv?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Listen for new messages from socket
  useEffect(() => {
    if (!socketRef.current) return;
    const handler = (msg) => {
      if (msg.conversation_id === conv?.id) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    };
    socketRef.current.on('new_message', handler);
    return () => socketRef.current?.off('new_message', handler);
  }, [conv?.id, socketRef.current]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/conversations/${conv.id}/messages`);
      setMessages(res.data.data);
      // Join socket room
      socketRef.current?.emit('join_conversation', conv.id);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;
    socketRef.current.emit('send_message', {
      conversation_id: conv.id,
      content: input.trim(),
    });
    setInput('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post(
        `/conversations/${conv.id}/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      socketRef.current?.emit('send_message', {
        conversation_id: conv.id,
        content: '',
        file_url: res.data.file_url,
        file_type: res.data.file_type,
      });
    } catch (err) {
      console.error('Image upload error:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isMe = (msg) => msg.sender_id === currentUser?.id;

  const adopterName = conv.is_anonymous
    ? 'Anonymous'
    : `${conv.adopter?.first_name || ''} ${conv.adopter?.last_name || ''}`.trim();

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="px-5 py-3 border-b border-gray-100 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
            {adopterName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{adopterName}</p>
            <p className="text-xs text-gray-400">
              Asking about <span className="text-blue-500 font-medium">{conv.pet?.name}</span>
            </p>
          </div>
        </div>
        <StatusBadge status={conv.status} />
      </div>

      {/* Anonymous notice */}
      {conv.is_anonymous && (
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-2">
          <p className="text-xs text-amber-700">
            🔒 This person is chatting anonymously. Their identity will be revealed when they apply for adoption.
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-gray-50">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <Loader2 size={20} className="animate-spin text-gray-300" />
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <PawPrint size={32} className="text-gray-200 mx-auto mb-2" />
              <p className="text-xs text-gray-400">No messages yet</p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${isMe(msg) ? 'justify-end' : 'justify-start'}`}>
            {!isMe(msg) && (
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold mr-2 shrink-0 mt-1">
                A
              </div>
            )}
            <div className={`max-w-[65%] rounded-2xl px-3 py-2 ${
              isMe(msg)
                ? 'bg-[#3182CE] text-white rounded-br-sm'
                : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
            }`}>
              {msg.file_url ? (
                <img src={msg.file_url} alt="attachment"
                  className="rounded-lg max-w-full max-h-40 object-cover" />
              ) : (
                <p className="text-sm leading-relaxed">{msg.content}</p>
              )}
              <p className={`text-[10px] mt-1 ${isMe(msg) ? 'text-blue-200' : 'text-gray-400'}`}>
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 px-4 py-3 bg-white flex items-center gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingImage}
          className="text-gray-400 hover:text-blue-500 transition-colors shrink-0"
        >
          {uploadingImage
            ? <Loader2 size={18} className="animate-spin" />
            : <Image size={18} />
          }
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
          placeholder="Type a reply..."
          className="flex-1 text-sm bg-gray-50 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 border border-gray-100"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="bg-[#3182CE] hover:bg-[#2b6cb0] text-white rounded-full p-2 transition-colors disabled:opacity-40 shrink-0"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}

// ── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const socketRef = useRef(null);
  const currentUser = UserService.getCurrentUser();

  useEffect(() => {
    loadConversations();
    initSocket();
    return () => socketRef.current?.disconnect();
  }, []);

  const initSocket = () => {
  const token = localStorage.getItem('accessToken');
  
  // Get socket URL from env, fallback to localhost
  const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
  
  const socket = io(socketUrl, {
    query: { token },
    transports: ['websocket'],
  });
  
  socket.on('connect', () => console.log('Shelter socket connected'));
  socket.on('connect_error', (err) => console.error('Socket error:', err.message));
  socketRef.current = socket;
};

  const loadConversations = async () => {
    try {
      const res = await api.get('/conversations');
      setConversations(res.data.data);
      if (res.data.data.length > 0) setActiveConv(res.data.data[0]);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredConvs = conversations.filter((c) => {
    const petName = c.pet?.name?.toLowerCase() || '';
    const s = search.toLowerCase();
    return petName.includes(s);
  });

  return (
    <div className="flex min-h-screen bg-[#f5f7fa]">
      <Sidebar />

      <div className="flex-1 flex overflow-hidden" style={{ height: '100vh' }}>

        {/* Conversation List */}
        <div className="w-72 bg-white border-r border-gray-100 flex flex-col shrink-0">
          <div className="px-4 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-[#1B3A4B] mb-3">Messages</h2>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <Search size={13} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-xs bg-transparent focus:outline-none text-gray-600 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-10">
                <Loader2 size={18} className="animate-spin text-gray-300" />
              </div>
            )}
            {!loading && filteredConvs.length === 0 && (
              <div className="text-center py-10">
                <MessageSquare size={28} className="text-gray-200 mx-auto mb-2" />
                <p className="text-xs text-gray-400">No conversations yet</p>
              </div>
            )}
            {filteredConvs.map((conv) => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                isActive={activeConv?.id === conv.id}
                onClick={() => setActiveConv(conv)}
              />
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeConv ? (
            <ChatWindow
              conv={activeConv}
              currentUser={currentUser}
              socketRef={socketRef}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageSquare size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-400">Select a conversation</p>
                <p className="text-xs text-gray-300 mt-1">Choose from the list to start chatting</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}