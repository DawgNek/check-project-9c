# 🌸 9C – Roots & Bloom
> React + Vite + Firebase + Vercel

---

## 📁 Cấu trúc
```
src/
  lib/         ← firebase.js · AuthContext.jsx · firestore.js
  components/  ← Navbar · PetalBg
  pages/       ← 9 trang + OtherPages (Playlist/Privacy/Terms/Credit/Ending)
  styles/      ← globals.css (design tokens)
  App.jsx      ← Router + Protected routes
public/
  manifest.json · sw.js · favicon.svg
```

---

## 🚀 Cài đặt nhanh

### 1. Install
```bash
npm install
```

### 2. Tạo Firebase project
- [console.firebase.google.com](https://console.firebase.google.com)
- Bật: **Authentication** (Email/Password) · **Firestore** · **Storage**

### 3. Firestore Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Storage Rules
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Tạo `.env.local`
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 6. Chạy local
```bash
npm run dev
```

---

## 🌐 Deploy Vercel

1. Push lên GitHub
2. Import vào [vercel.com](https://vercel.com)
3. **Settings → Environment Variables** → thêm 6 biến `VITE_FIREBASE_*`
4. Deploy ✅

---

## ✏️ Tùy chỉnh

| File | Thay gì |
|------|---------|
| `SeatingPage.jsx` | `STUDENTS` — 44 tên học sinh theo thứ tự ngồi |
| `App.jsx`         | `BIRTHDAYS` — sinh nhật từng học sinh |
| `HomePage.jsx`    | `EXAM_DATE` — ngày thi vào 10 chính xác |
| `ChungPage.jsx`   | `UNLOCK_DATE` — ngày mở khóa ký ức |
| `OtherPages.jsx`  | Link Spotify playlist + tên credit |
| `public/`         | Thêm `icon-192.png` và `icon-512.png` cho PWA |

---

## 🗄️ Firestore Collections
```
/memories/{userId}     — ảnh + lời nhắn tương lai
/locket/{autoId}       — ảnh locket theo ngày
/reviews/{deskId}/items — nhận xét bạn bè
/signatures/{userId}   — chữ ký canvas
/streaks/{userId}      — streak upload hằng ngày
```

---

*Made with 🌸 for 9C · Roots & Bloom · 2025–2026*
