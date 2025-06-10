# notick
Notick – is an AI-powered journaling app where you can take notes and brainstorm your ideas then generate new outputs and sparks that fits your style!

**Notick** is a full-stack journaling web app built with **Flask** and **React** that allows users to:
- Securely register and log in
- Create, edit, and manage journal notes
- Start rich, interactive AI conversations treated like journal entries
- Use a sleek interface inspired by apps like Obsidian and ChatGPT

---

## 🚀 Features

- 🔐 **Authentication**: Secure login & registration
- 📝 **Note Management**: Create, view, and edit journal entries
- 🤖 **AI Conversations**: Launch conversations with an AI assistant and store them as note threads
- 🧭 **Sidebar Navigation**: Toggleable sidebar with a list of notes and chat entries
- ✨ **Rich Text Editor** (coming soon): For better formatting of notes and AI chats
- 🌐 **RESTful Backend**: Built with Flask + SQLAlchemy

---

## 🧩 Tech Stack

### Frontend:
- React (Vite)
- Tailwind CSS (optional)
- Axios

### Backend:
- Python 3.x
- Flask
- SQLAlchemy
- SQLite (for development)

---

## ⚙️ Getting Started

### Frontend Setup
cd frontend
npm install
npm run dev

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
python app.py


