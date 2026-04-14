// src/pages/ChatPage.jsx — Full messenger with private + group chat
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../lib/AuthContext';
import {
  getConversations, getMessages, sendMessage,
  getOnlineUsers, getOrCreatePrivateChat, ensureGroupChat,
} from '../lib/firestore';
import toast from 'react-hot-toast';

/* ── helpers ─────────────────────────────────────────── */
const fmtTime = ts => {
  if (!ts) return '';
  const d = ts.toDate?.() || new Date(ts);
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const getInitial = name => (name || '?')[0].toUpperCase();

const AVATAR_COLORS = [
  ['#fde8ef','#d4758a'],['#e8f4e8','#5a8a58'],['#fff8e0','#c8900a'],
  ['#e8f0fd','#5a6aaa'],['#f4e8fd','#8a5aaa'],['#fde8e8','#aa5a5a'],
];
const avatarColor = name => AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

/* ── Avatar component ───────────────────────────────── */
function Avatar({ name, size = 36, online = false }) {
  const [bg, txt] = avatarColor(name);
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{ width: size, height: size, borderRadius: '50%', background: bg, border: `2px solid ${txt}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: size * .38, fontWeight: 700, color: txt }}>
        {getInitial(name)}
      </div>
      {online && <div style={{ position: 'absolute', bottom: 1, right: 1, width: size * .28, height: size * .28, borderRadius: '50%', background: '#4caf50', border: '2px solid var(--ivory)' }} />}
    </div>
  );
}

/* ── Sidebar conversation item ─────────────────────── */
function ConvItem({ conv, active, online, onClick, currentUserId }) {
  const name = conv.isGroup ? conv.name : (conv.otherName || '...');
  const isOnline = conv.isGroup ? false : online;
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
      cursor: 'pointer', transition: 'background .2s', borderRadius: 12,
      background: active ? 'rgba(240,160,184,.18)' : 'transparent',
    }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(240,160,184,.09)'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
      <Avatar name={name} size={42} online={isOnline} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '.97rem', fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>{name}</span>
          {conv.lastMessageTime && <span style={{ fontSize: '.7rem', color: 'var(--ink-faint)', flexShrink: 0 }}>{fmtTime(conv.lastMessageTime)}</span>}
        </div>
        <div style={{ fontSize: '.82rem', color: 'var(--ink-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontStyle: 'italic' }}>
          {conv.lastMessage || 'Bắt đầu cuộc trò chuyện...'}
        </div>
      </div>
    </div>
  );
}

/* ── Message bubble ─────────────────────────────────── */
function MsgBubble({ msg, isMine, showAvatar, nextIsMine }) {
  return (
    <div style={{ display: 'flex', flexDirection: isMine ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8, marginBottom: nextIsMine === isMine ? 3 : 10 }}>
      {!isMine && (showAvatar
        ? <Avatar name={msg.senderName} size={28} />
        : <div style={{ width: 28 }} />
      )}
      <div style={{ maxWidth: '72%' }}>
        {showAvatar && !isMine && (
          <div style={{ fontFamily: 'var(--font-label)', fontSize: '.62rem', letterSpacing: '.08em', color: 'var(--ink-faint)', marginBottom: 3, paddingLeft: 4 }}>
            {msg.senderName?.split(' ').slice(-1)[0]}
          </div>
        )}
        {msg.imageUrl && (
          <img src={msg.imageUrl} alt="" style={{ maxWidth: '100%', borderRadius: 12, marginBottom: msg.text ? 4 : 0, display: 'block', border: '1px solid var(--border)' }} />
        )}
        {msg.text && (
          <div style={{
            padding: '10px 14px', borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            background: isMine
              ? 'linear-gradient(135deg,var(--petal-deep),var(--rose-soft))'
              : 'rgba(255,255,255,.85)',
            color: isMine ? '#fff' : 'var(--ink)',
            fontFamily: 'var(--font-body)', fontSize: '.95rem', lineHeight: 1.55,
            boxShadow: isMine ? '0 3px 14px rgba(240,160,184,.3)' : 'var(--shadow-sm)',
            border: isMine ? 'none' : '1px solid var(--border)',
            wordBreak: 'break-word',
          }}>
            {msg.text}
          </div>
        )}
        <div style={{ fontSize: '.65rem', color: 'var(--ink-faint)', marginTop: 3, textAlign: isMine ? 'right' : 'left', paddingInline: 4 }}>
          {fmtTime(msg.createdAt)}
        </div>
      </div>
    </div>
  );
}

/* ── Main ChatPage ──────────────────────────────────── */
export default function ChatPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [onlineUsers,   setOnlineUsers]   = useState([]);
  const [activeConvId,  setActiveConvId]  = useState('group_9c');
  const [messages,      setMessages]      = useState([]);
  const [text,          setText]          = useState('');
  const [imgFile,       setImgFile]       = useState(null);
  const [imgPrev,       setImgPrev]       = useState(null);
  const [sending,       setSending]       = useState(false);
  const [sideOpen,      setSideOpen]      = useState(false);
  const endRef    = useRef(null);
  const inputRef  = useRef(null);

  // Init group chat
  useEffect(() => { ensureGroupChat(); }, []);

  // Conversations
  useEffect(() => {
    const unsub = getConversations(user.uid, convs => {
      // Attach otherName for private chats
      const enriched = convs.map(c => {
        if (!c.isGroup && c.members) {
          const otherId = c.members.find(id => id !== user.uid);
          const otherOnline = onlineUsers.find(o => o.userId === otherId);
          return { ...c, otherName: otherOnline?.userName || '...', otherId };
        }
        return c;
      });
      setConversations(enriched);
    });
    return unsub;
  }, [user.uid, onlineUsers]);

  // Online users
  useEffect(() => {
    const unsub = getOnlineUsers(setOnlineUsers);
    return unsub;
  }, []);

  // Messages for active conversation
  useEffect(() => {
    if (!activeConvId) return;
    const unsub = getMessages(activeConvId, setMessages);
    return unsub;
  }, [activeConvId]);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeConv = conversations.find(c => c.id === activeConvId);
  const convName = activeConv?.isGroup ? activeConv.name : (activeConv?.otherName || 'Chat');

  const isOnline = uid => {
    const u = onlineUsers.find(o => o.userId === uid);
    if (!u?.lastActive) return false;
    const diff = Date.now() - (u.lastActive?.toDate?.()?.getTime?.() || 0);
    return diff < 3 * 60 * 1000;
  };

  const openPrivate = async otherId => {
    const cid = await getOrCreatePrivateChat(user.uid, otherId);
    setActiveConvId(cid);
    setSideOpen(false);
  };

  const handleSend = async () => {
    if (!text.trim() && !imgFile) return;
    setSending(true);
    try {
      await sendMessage(activeConvId, user.uid, user.displayName || 'Ẩn danh', text, imgFile);
      setText(''); setImgFile(null); setImgPrev(null);
      inputRef.current?.focus();
    } catch { toast.error('Gửi thất bại'); }
    finally { setSending(false); }
  };

  const handleImg = e => {
    const f = e.target.files[0]; if (!f) return;
    setImgFile(f);
    const r = new FileReader();
    r.onload = ev => setImgPrev(ev.target.result);
    r.readAsDataURL(f);
    e.target.value = '';
  };

  // ── Responsive layout ─────────────────────────────
  const isMobile = window.innerWidth < 768;
  const showSidebar = !isMobile || sideOpen;
  const showChat    = !isMobile || !sideOpen;

  return (
    <div style={{ height: '100dvh', display: 'flex', paddingTop: 'var(--nav-h)', background: 'transparent', position: 'relative', zIndex: 10 }}>
      <style>{`
        .msg-input:focus{outline:none;border-color:var(--petal-deep)!important;box-shadow:0 0 0 3px rgba(240,160,184,.15)}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      `}</style>

      {/* ── Sidebar ────────────────────────────────── */}
      {showSidebar && (
        <div style={{
          width: isMobile ? '100%' : 300, flexShrink: 0,
          background: 'rgba(253,248,240,.95)', backdropFilter: 'blur(20px)',
          borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
          height: '100%', overflowY: 'auto',
        }}>
          {/* Sidebar header */}
          <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border-soft)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 12 }}>Tin nhắn</div>
            {/* Online count */}
            <div style={{ fontFamily: 'var(--font-label)', fontSize: '.62rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--rose-soft)', marginBottom: 10 }}>
              {onlineUsers.filter(u => isOnline(u.userId)).length} đang online
            </div>
            {/* Scrollable online avatars */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
              {onlineUsers.filter(u => u.userId !== user.uid).map(u => (
                <div key={u.userId} onClick={() => openPrivate(u.userId)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', flexShrink: 0 }}>
                  <Avatar name={u.userName} size={38} online={isOnline(u.userId)} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '.68rem', color: 'var(--ink-muted)', maxWidth: 44, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.userName?.split(' ').slice(-1)[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Conversations */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
            {/* Group chat always first */}
            <ConvItem
              conv={{ id:'group_9c', isGroup:true, name:'9C mãi yêu 💕', lastMessage: conversations.find(c=>c.id==='group_9c')?.lastMessage || '', lastMessageTime: conversations.find(c=>c.id==='group_9c')?.lastMessageTime }}
              active={activeConvId === 'group_9c'}
              onClick={() => { setActiveConvId('group_9c'); setSideOpen(false); }}
              currentUserId={user.uid}
            />
            <div style={{ fontFamily: 'var(--font-label)', fontSize: '.6rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-faint)', padding: '8px 16px 4px' }}>Trò chuyện riêng</div>
            {conversations.filter(c => !c.isGroup).map(c => (
              <ConvItem key={c.id} conv={c} active={activeConvId === c.id}
                online={isOnline(c.otherId)}
                onClick={() => { setActiveConvId(c.id); setSideOpen(false); }}
                currentUserId={user.uid}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Chat panel ─────────────────────────────── */}
      {showChat && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'rgba(253,248,240,.6)', backdropFilter: 'blur(8px)' }}>
          {/* Chat header */}
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(253,248,240,.9)', backdropFilter: 'blur(20px)', flexShrink: 0 }}>
            {isMobile && (
              <button onClick={() => setSideOpen(true)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--rose-soft)', fontSize: '1.1rem', cursor: 'pointer' }}>‹</button>
            )}
            <Avatar name={convName} size={36} online={!activeConv?.isGroup && isOnline(activeConv?.otherId)} />
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, color: 'var(--ink)' }}>{convName}</div>
              <div style={{ fontFamily: 'var(--font-label)', fontSize: '.6rem', letterSpacing: '.1em', textTransform: 'uppercase', color: !activeConv?.isGroup && isOnline(activeConv?.otherId) ? '#4caf50' : 'var(--ink-faint)' }}>
                {!activeConv?.isGroup && isOnline(activeConv?.otherId) ? 'Đang online' : activeConv?.isGroup ? 'Nhóm lớp' : 'Offline'}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 0 }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', margin: 'auto', fontFamily: 'var(--font-heading)', fontSize: '.95rem', fontStyle: 'italic', color: 'var(--ink-faint)', padding: '40px 20px' }}>
                Bắt đầu cuộc trò chuyện... ✿
              </div>
            )}
            {messages.map((msg, i) => {
              const isMine = msg.senderId === user.uid;
              const prev   = messages[i - 1];
              const next   = messages[i + 1];
              const showAvatar = !isMine && (!prev || prev.senderId !== msg.senderId);
              const nextIsMine = next?.senderId === user.uid;
              return (
                <MsgBubble key={msg.id} msg={msg} isMine={isMine}
                  showAvatar={showAvatar} nextIsMine={nextIsMine} />
              );
            })}
            <div ref={endRef} />
          </div>

          {/* Image preview */}
          {imgPrev && (
            <div style={{ padding: '8px 16px 0', flexShrink: 0 }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img src={imgPrev} alt="" style={{ height: 80, borderRadius: 10, border: '1px solid var(--border)', objectFit: 'cover' }} />
                <button onClick={() => { setImgFile(null); setImgPrev(null); }} style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: 'var(--rose-soft)', color: '#fff', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}>✕</button>
              </div>
            </div>
          )}

          {/* Input bar */}
          <div style={{ padding: '10px 14px 14px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(253,248,240,.95)', flexShrink: 0 }}>
            <label style={{ cursor: 'pointer', flexShrink: 0, width: 38, height: 38, borderRadius: '50%', background: 'rgba(240,160,184,.15)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', transition: 'background .2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(240,160,184,.28)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(240,160,184,.15)'}>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImg} />
              📷
            </label>
            <input
              ref={inputRef}
              className="msg-input"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Nhắn gì đó..."
              style={{ flex: 1, padding: '10px 16px', borderRadius: 24, border: '1.5px solid var(--border)', background: 'rgba(255,255,255,.8)', fontFamily: 'var(--font-body)', fontSize: '.95rem', color: 'var(--ink)', outline: 'none', transition: 'all .2s' }}
            />
            <button onClick={handleSend} disabled={sending || (!text.trim() && !imgFile)}
              style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', transition: 'all .25s', flexShrink: 0,
                background: (text.trim() || imgFile) ? 'linear-gradient(135deg,var(--petal-deep),var(--rose-soft))' : 'rgba(240,160,184,.2)',
                color: (text.trim() || imgFile) ? '#fff' : 'var(--ink-faint)',
                boxShadow: (text.trim() || imgFile) ? '0 4px 14px rgba(240,160,184,.35)' : 'none',
              }}>
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
