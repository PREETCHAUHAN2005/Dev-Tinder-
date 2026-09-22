import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { Base_Url } from "../utils/constants";

const Chat = () => {
  const { userId } = useParams();
  const [inbox, setInbox] = useState([]);
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);
  const socketRef = useRef(null);

  const loadInbox = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(Base_Url + "/chat", { withCredentials: true });
      setInbox(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load chats.");
    } finally {
      setLoading(false);
    }
  };

  const loadThread = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(Base_Url + "/chat/" + userId, { withCredentials: true });
      setMessages(res.data?.data || []);
      setOtherUser(res.data?.user || null);
    } catch (err) {
      const status = err.response?.status;
      if (status === 403) {
        setError("Chat opens after you both accept the connection.");
      } else {
        setError(err.response?.data?.message || "Could not load this conversation.");
      }
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      loadInbox();
      return;
    }
    loadThread();
  }, [userId]);

  useEffect(() => {
    if (!userId) return undefined;
    const socket = io(Base_Url, { withCredentials: true });
    socketRef.current = socket;
    socket.emit("chat:join", { userId });
    socket.on("chat:message", (message) => {
      const asId = (value) => String(value?._id || value || "");
      const involvesThread =
        asId(message?.fromUserId) === String(userId) || asId(message?.toUserId) === String(userId);
      if (!involvesThread) return;
      setMessages((current) => {
        if (current.some((item) => item._id === message._id)) return current;
        return [...current, message];
      });
      if (asId(message?.fromUserId) === String(userId)) {
        axios
          .get(Base_Url + "/chat/" + userId, { withCredentials: true })
          .then((res) => setMessages(res.data?.data || []))
          .catch(() => {});
      }
    });
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setError("");
    try {
      const res = await axios.post(
        Base_Url + "/chat/" + userId,
        { text: trimmed },
        { withCredentials: true }
      );
      const saved = res.data?.data;
      if (saved) {
        setMessages((current) => {
          if (current.some((item) => item._id === saved._id)) return current;
          return [...current, saved];
        });
      }
      setText("");
    } catch (err) {
      setError(err.response?.data?.message || "Message was not sent.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-ring loading-lg text-[#3444DA]"></span>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="max-w-2xl mx-auto my-10 px-6">
        <h1 className="text-3xl font-extrabold text-white font-Outfit">Chat</h1>
        <p className="text-slate-400 text-sm mt-2 mb-8">
          Messages with developers who accepted your connection.
        </p>
        {error && <p className="text-rose-400 text-sm mb-4">{error}</p>}
        {inbox.length === 0 ? (
          <div className="text-center py-16 bg-[#16161a] border border-slate-800 rounded-2xl">
            <h2 className="text-lg font-bold text-slate-200">No conversations yet</h2>
            <p className="text-slate-400 text-sm mt-2">Match with someone, then open chat from Connections.</p>
            <Link to="/connections" className="inline-block mt-5 text-[#8ea0ff] font-semibold">
              View connections
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {inbox.map((row) => (
              <Link
                key={row.user._id}
                to={`/chat/${row.user._id}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#16161a] border border-slate-800 hover:border-[#3444DA]/50"
              >
                <img
                  src={row.user.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1 text-left">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-bold text-white truncate">
                      {row.user.firstname} {row.user.lastname}
                    </h2>
                    {row.unreadCount > 0 && (
                      <span className="text-[10px] font-bold bg-[#3444DA] text-white rounded-full px-2 py-0.5">
                        {row.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm truncate">
                    {row.lastMessage?.text || "Start the conversation"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-6 px-4 flex flex-col min-h-[70vh]">
      <div className="flex items-center gap-3 mb-4">
        <Link to="/chat" className="text-slate-400 text-sm hover:text-white">
          Back
        </Link>
        <img
          src={otherUser?.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
          alt=""
          className="w-10 h-10 rounded-full object-cover"
        />
        <h1 className="text-lg font-bold text-white font-Outfit">
          {otherUser ? `${otherUser.firstname} ${otherUser.lastname}` : "Chat"}
        </h1>
      </div>

      {error && <p className="text-rose-400 text-sm mb-3">{error}</p>}

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto rounded-2xl bg-[#121214] border border-slate-800 p-4 space-y-3 min-h-[420px]"
      >
        {messages.length === 0 && !error && (
          <p className="text-slate-500 text-sm text-center mt-10">Send the first message.</p>
        )}
        {messages.map((message) => {
          const otherId = message.toUserId?._id || message.toUserId;
          const mine = String(otherId) === String(userId);
          return (
            <div key={message._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                  mine ? "bg-[#3444DA] text-white" : "bg-[#1d1d22] text-slate-100 border border-slate-800"
                }`}
              >
                {message.text}
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={sendMessage} className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={1000}
          placeholder="Write a message"
          className="flex-1 rounded-full bg-[#16161a] border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-[#3444DA]"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="rounded-full bg-[#3444DA] text-white font-bold px-5 disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
