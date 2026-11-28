import Avatar from "./ui/Avatar";
import PageHeading from "./ui/PageHeading";
import StatePanel from "./ui/StatePanel";
import Icon from "./ui/Icon";
import { useEffect, useRef, useState } from "react";
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
    return <section className="dt-page dt-page-narrow"><PageHeading title="Messages" /><StatePanel loading title="Loading your conversations" icon="message" /></section>;
  }

  if (!userId) {
    return (
      <section className="dt-page dt-page-narrow">
        <PageHeading title="Messages" description="Conversations with the developers you’ve connected with." />
        {error && <p className="dt-alert dt-alert-error" role="alert"><Icon name="alert" />{error}<button type="button" onClick={loadInbox}>Try again</button></p>}
        {inbox.length === 0 && !error ? <StatePanel title="No conversations yet" description="Once you've connected, start a conversation from Connections." icon="message"><Link className="dt-button dt-button-primary" to="/connections">View connections<Icon name="arrow" /></Link></StatePanel> : (
          <div className="dt-inbox dt-panel">
            {inbox.map((row) => <Link key={row.user._id} to={`/chat/${row.user._id}`} className="dt-inbox-row">
              <Avatar src={row.user.photoUrl} name={`${row.user.firstname} ${row.user.lastname}`} decorative />
              <div className="dt-inbox-person"><h2>{row.user.firstname} {row.user.lastname}</h2><p>{row.lastMessage?.text || "Start the conversation"}</p></div>
              {row.unreadCount > 0 && <span className="dt-unread-count" aria-label={`${row.unreadCount} unread messages`}>{row.unreadCount}</span>}
              <Icon name="arrow" />
            </Link>)}
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="dt-page dt-thread-page">
      <div className="dt-thread dt-panel">
        <header className="dt-thread-header">
          <Link to="/chat" className="dt-icon-button" aria-label="Back to messages"><Icon name="back" /></Link>
          <Avatar src={otherUser?.photoUrl} name={otherUser ? `${otherUser.firstname} ${otherUser.lastname}` : "Developer"} decorative />
          <div><h1>{otherUser ? `${otherUser.firstname} ${otherUser.lastname}` : "Conversation"}</h1></div>
        </header>
        {error && <p className="dt-alert dt-alert-error" role="alert"><Icon name="alert" />{error}</p>}
        <div ref={listRef} className="dt-message-list" role="log" aria-label="Conversation messages" aria-live="polite" tabIndex={0}>
          {messages.length === 0 && !error && <div className="dt-chat-icebreaker"><span><Icon name="message" /></span><h2>Start with a hello.</h2><p>Ask what they're building, share an idea, or find some common ground.</p></div>}
          {messages.map((message) => {
            const otherId = message.toUserId?._id || message.toUserId;
            const mine = String(otherId) === String(userId);
            return <div key={message._id} className={`dt-message-row ${mine ? "dt-message-mine" : ""}`}><div className="dt-message-bubble"><span className="dt-sr-only">{mine ? "You: " : `${otherUser?.firstname || "Developer"}: `}</span>{message.text}</div></div>;
          })}
        </div>
        <form onSubmit={sendMessage} className="dt-message-form" aria-busy={sending}>
          <label htmlFor="chat-message" className="dt-sr-only">Write a message</label>
          <input id="chat-message" value={text} onChange={(event) => setText(event.target.value)} maxLength={1000} placeholder="Write a message…" autoComplete="off" />
          <button type="submit" disabled={sending || !text.trim()} className="dt-button dt-button-primary" aria-label={sending ? "Sending message" : "Send message"}><span>{sending ? "Sending..." : "Send"}</span><Icon name="send" /></button>
        </form>
      </div>
    </section>
  );
};

export default Chat;
