// src/lib/firestore.js
import {
  collection, addDoc, getDocs, doc, setDoc, getDoc,
  query, orderBy, onSnapshot, updateDoc, arrayUnion,
  serverTimestamp, where, limit, deleteDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

// ─── MEMORIES ────────────────────────────────────────────────
export const submitMemory = async (userId, userName, message, imageFile) => {
  let imageUrl = null;
  if (imageFile) {
    const storageRef = ref(storage, `memories/${userId}_${Date.now()}`);
    const snap = await uploadBytes(storageRef, imageFile);
    imageUrl = await getDownloadURL(snap.ref);
  }
  await setDoc(doc(db, 'memories', userId), {
    userId, userName, message, imageUrl,
    createdAt: serverTimestamp(),
    locked: true,
  });
};

export const getMemories = (callback) => {
  const q = query(collection(db, 'memories'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap =>
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );
};

export const getMyMemory = async (userId) => {
  const snap = await getDoc(doc(db, 'memories', userId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// ─── LOCKET ──────────────────────────────────────────────────
export const uploadLocketPhoto = async (userId, userName, imageFile) => {
  const storageRef = ref(storage, `locket/${userId}_${Date.now()}`);
  const snap = await uploadBytes(storageRef, imageFile);
  const imageUrl = await getDownloadURL(snap.ref);
  await addDoc(collection(db, 'locket'), {
    userId, userName, imageUrl,
    reactions: {},
    createdAt: serverTimestamp(),
    dateStr: new Date().toLocaleDateString('vi-VN'),
  });
};

export const getLocket = (callback) => {
  const q = query(collection(db, 'locket'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap =>
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );
};

export const addReaction = async (photoId, emoji) => {
  const docRef = doc(db, 'locket', photoId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return;
  const reactions = snap.data().reactions || {};
  reactions[emoji] = (reactions[emoji] || 0) + 1;
  await updateDoc(docRef, { reactions });
};

// ─── REVIEWS (BẠN TRONG MẮT NGƯỜI KHÁC) ────────────────────
export const addReview = async (targetStudentId, authorName, text, flower) => {
  await addDoc(collection(db, `reviews/${targetStudentId}/items`), {
    authorName, text, flower,
    createdAt: serverTimestamp(),
  });
};

export const getReviews = (studentId, callback) => {
  const q = query(
    collection(db, `reviews/${studentId}/items`),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, snap =>
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );
};

// ─── SIGNATURES ───────────────────────────────────────────────
export const saveSignature = async (userId, userName, dataUrl) => {
  // Convert dataUrl to blob
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const storageRef = ref(storage, `signatures/${userId}_${Date.now()}.png`);
  const snap = await uploadBytes(storageRef, blob);
  const imageUrl = await getDownloadURL(snap.ref);
  await setDoc(doc(db, 'signatures', userId), {
    userId, userName, imageUrl,
    createdAt: serverTimestamp(),
  });
};

export const getSignatures = (callback) => {
  const q = query(collection(db, 'signatures'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, snap =>
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );
};

// ─── USER STREAK ──────────────────────────────────────────────
export const updateStreak = async (userId) => {
  const docRef = doc(db, 'streaks', userId);
  const snap = await getDoc(docRef);
  const today = new Date().toDateString();
  if (snap.exists()) {
    const { lastUpload, count } = snap.data();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const newCount = lastUpload === yesterday ? count + 1 : lastUpload === today ? count : 1;
    await setDoc(docRef, { lastUpload: today, count: newCount });
    return newCount;
  } else {
    await setDoc(docRef, { lastUpload: today, count: 1 });
    return 1;
  }
};

export const getStreak = async (userId) => {
  const snap = await getDoc(doc(db, 'streaks', userId));
  return snap.exists() ? snap.data().count : 0;
};

// ─── ONLINE STATUS ────────────────────────────────────────────
export const updateOnlineStatus = async (userId, userName, photoURL = null) => {
  await setDoc(doc(db, 'online', userId), {
    userId, userName, photoURL,
    lastActive: serverTimestamp(),
    isOnline: true,
  }, { merge: true });
};

export const setOffline = async (userId) => {
  await updateDoc(doc(db, 'online', userId), {
    isOnline: false,
    lastActive: serverTimestamp(),
  }).catch(() => {});
};

export const getOnlineUsers = (callback) => {
  const q = query(collection(db, 'online'), orderBy('lastActive', 'desc'));
  return onSnapshot(q, snap =>
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );
};

// ─── CHAT SYSTEM ─────────────────────────────────────────────
// Conversations: /conversations/{id} with members[], isGroup, name
// Messages: /conversations/{id}/messages/{msgId}

export const ensureGroupChat = async () => {
  const groupRef = doc(db, 'conversations', 'group_9c');
  const snap = await getDoc(groupRef);
  if (!snap.exists()) {
    await setDoc(groupRef, {
      isGroup: true,
      name: '9C mãi yêu 💕',
      members: [],
      createdAt: serverTimestamp(),
      lastMessage: '',
      lastMessageTime: serverTimestamp(),
    });
  }
  return 'group_9c';
};

export const getOrCreatePrivateChat = async (uid1, uid2) => {
  const chatId = [uid1, uid2].sort().join('_');
  const ref_ = doc(db, 'conversations', chatId);
  const snap = await getDoc(ref_);
  if (!snap.exists()) {
    await setDoc(ref_, {
      isGroup: false,
      members: [uid1, uid2],
      createdAt: serverTimestamp(),
      lastMessage: '',
      lastMessageTime: serverTimestamp(),
    });
  }
  return chatId;
};

export const sendMessage = async (conversationId, senderId, senderName, text, imageFile = null) => {
  let imageUrl = null;
  if (imageFile) {
    const r = ref(storage, `chat/${conversationId}/${Date.now()}`);
    const s = await uploadBytes(r, imageFile);
    imageUrl = await getDownloadURL(s.ref);
  }
  const msgRef = collection(db, 'conversations', conversationId, 'messages');
  await addDoc(msgRef, {
    senderId, senderName, text: text.trim(), imageUrl,
    createdAt: serverTimestamp(),
    readBy: [senderId],
  });
  await updateDoc(doc(db, 'conversations', conversationId), {
    lastMessage: imageUrl ? '📷 Ảnh' : text.trim(),
    lastMessageTime: serverTimestamp(),
  });
};

export const getMessages = (conversationId, callback) => {
  const q = query(
    collection(db, 'conversations', conversationId, 'messages'),
    orderBy('createdAt', 'asc'),
    limit(100)
  );
  return onSnapshot(q, snap =>
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );
};

export const getConversations = (userId, callback) => {
  const q = query(collection(db, 'conversations'), orderBy('lastMessageTime', 'desc'));
  return onSnapshot(q, snap => {
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    // Show group + private chats involving this user
    const filtered = all.filter(c =>
      c.isGroup || (c.members && c.members.includes(userId))
    );
    callback(filtered);
  });
};

// ─── STORY SYSTEM ────────────────────────────────────────────
// Stories expire after 24h — filter client-side
export const uploadStory = async (userId, userName, imageFile, caption = '') => {
  const r = ref(storage, `stories/${userId}_${Date.now()}`);
  const s = await uploadBytes(r, imageFile);
  const imageUrl = await getDownloadURL(s.ref);
  await addDoc(collection(db, 'stories'), {
    userId, userName, imageUrl, caption,
    createdAt: serverTimestamp(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    viewers: [],
  });
};

export const getActiveStories = (callback) => {
  // Get recent stories — filter by 24h client-side
  const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'), limit(60));
  return onSnapshot(q, snap => {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const active = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(s => s.createdAt?.toDate?.() > cutoff);
    // Group by user
    const grouped = {};
    active.forEach(s => {
      if (!grouped[s.userId]) grouped[s.userId] = { userId: s.userId, userName: s.userName, stories: [] };
      grouped[s.userId].stories.push(s);
    });
    callback(Object.values(grouped));
  });
};

export const markStoryViewed = async (storyId, viewerId) => {
  await updateDoc(doc(db, 'stories', storyId), {
    viewers: arrayUnion(viewerId),
  }).catch(() => {});
};

// ─── LOCKET WITH CAMERA ───────────────────────────────────────
export const uploadLocketFromCamera = async (userId, userName, blob) => {
  const r = ref(storage, `locket/${userId}_${Date.now()}`);
  const s = await uploadBytes(r, blob);
  const imageUrl = await getDownloadURL(s.ref);
  await addDoc(collection(db, 'locket'), {
    userId, userName, imageUrl,
    reactions: {},
    createdAt: serverTimestamp(),
    dateStr: new Date().toLocaleDateString('vi-VN'),
  });
  return imageUrl;
};
