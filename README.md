﻿# 🚀 MemeVerse - Real-Time Meme Battle with AI and Cyberpunk Vibes

MemeVerse is a real-time meme gallery application where users can create, vote, and bid on memes — powered by Socket.IO, Supabase, and Gemini AI. The UI blends neon-glow cyberpunk aesthetics with generative art and animations.

---

## 🛠️ Features

### 🧠 AI + Creativity
- ✨ **AI Caption & Vibe Generator** using Google Gemini

### 💬 Real-Time Collaboration
- 🗳️ **Upvote / Downvote Memes** with real-time updates
- 💸 **Live Bidding System** using Socket.IO
- 📈 **Live Leaderboard** that reflects changes in real-time

### 🖼️ Meme Management
- 🧾 **Create Meme** modal with image, title, and tags
- 📸 **Auto-assign default image** if not provided
- 🧠 **AI captions and vibe** stored alongside meme

### ⚡ UI & Aesthetics
- 🟣 **Cyberpunk-themed UI** with neon buttons
- 📜 Custom **scrollbars**, **modal blur effects**, and **responsive layout**

---

## 🔧 Tech Stack

| Layer            | Tools/Libraries                                     |
|------------------|-----------------------------------------------------|
| Frontend         | React, Vite, Tailwind CSS, React-P5, Socket.IO-Client |
| Backend          | Node.js, Express.js, Supabase (PostgreSQL), Socket.IO |
| AI Integration   | Google Gemini (via `@google/generative-ai`)        |
| Real-time Sync   | WebSocket events for memes, votes, and bids         |
| Styling          | Custom CSS (neon), Tailwind + scrollbar plugin      |

---

## 🧪 Getting Started

### 🚀 Local Setup

1. **Clone the repo**

```bash
git clone https://github.com/jatin/cityMall.git
cd cityMall
```

2. **Install dependencies**

```bash
cd backend
npm install

cd ../frontend
npm install
```

3. **Set up `.env`**

For both frontend and backend:

```bash
VITE_BACKEND_URL=http://localhost:5000
GEMINI_API_KEY=your_google_gemini_api_key
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_KEY=your_anon_or_service_role_key
```

4. **Run Backend**

```bash
cd backend
npm run dev
```

5. **Run Frontend**

```bash
cd frontend
npm run dev
```

---

## 🧠 Folder Structure

```bash
.
├── backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── services/       # Includes Gemini and Supabase clients
│   └── index.js
└── frontend
    ├── components/
    ├── hooks/
    ├── services/
    ├── utils/
    └── App.jsx
```

---

## 📦 Supabase Schema (Tables)

`memes`

| Column     | Type    |
| ---------- | ------- |
| id         | UUID    |
| title      | TEXT    |
| image\_url | TEXT    |
| tags       | TEXT\[] |
| upvotes    | INT     |
| caption    | TEXT    |
| vibe       | TEXT    |

`bids`

| Column   | Type |
| -------- | ---- |
| id       | UUID |
| meme\_id | UUID |
| user\_id | TEXT |
| credits  | INT  |

---

## 🌐 Deployment

This project is deployable on:
- Frontend → Vercel
- Backend → Render
---

## 🙌 Credits

- Built by Jatin
