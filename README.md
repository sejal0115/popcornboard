# 🎬 PopcornBoard

**PopcornBoard** is a modern React.js web application that lets users **discover the latest movies**, **save their favorites**, and **organize watchlists** — powered by the [TMDb API](https://www.themoviedb.org/) and backed by **Appwrite** for storage. While it doesn’t host video playback, it helps users **curate and track** what they want to watch later on their preferred streaming platforms.

---

## 🚀 Features

- 🔍 **Search & Discover** latest movies
- 🧡 **Favorite** movies to build a personal watchlist
- 🎯 **Track movie details** like rating, language, and release year
- 📁 **Data Persistence** with Appwrite
- 🎨 **Responsive UI** built with Tailwind CSS
- ⚡ **Fast performance** with Vite and React 19
- 🖱️ **Smooth animations** via Framer Motion

---

## 🛠️ Tech Stack

| Tech                | Description                          |
| ------------------- | ------------------------------------ |
| **React 19**        | Frontend framework                   |
| **Vite**            | Lightning-fast development tooling   |
| **Tailwind CSS**    | Utility-first CSS for modern UI      |
| **Appwrite**        | Backend for authentication & storage |
| **TMDb API**        | Movie data (posters, ratings, etc.)  |
| **Framer Motion**   | Animations & transitions             |
| **React Router v7** | SPA routing                          |

---

## 🧩 Project Structure

popcornboard/
├── public/
├── src/
│ ├── assets/
│ ├── components/
│ ├── pages/
│ ├── hooks/
│ ├── utils/
│ └── main.jsx
├── .env
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js

---

## 📦 Installation

1. **Clone the repo**

```bash
git clone https://github.com/your-username/popcornboard.git
cd popcornboard

### Install dependencies
npm install

### Configure environment
Create a .env file and add the following:
VITE_APPWRITE_ENDPOINT=your_appwrite_endpoint
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_db_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
VITE_APPWRITE_API_KEY=your_api_key
VITE_TMDB_API_KEY=your_tmdb_key

### Run the app
npm run dev
```
