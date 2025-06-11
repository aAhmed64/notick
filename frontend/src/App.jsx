import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import AuthPage from './components/authpage';
import {
  getCurrentUser,
  logout,
  getJournals,
  createJournal
} from './services/api';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const initialize = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData?.user) {
          setUser(userData.user);
          const data = await getJournals();
          setNotes(data);
          if (data.length > 0) setSelectedNoteId(data[0].id);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    initialize();
  }, []);

  const handleNewNote = async () => {
    try {
      const newNote = await createJournal({
        title: "Untitled",
        description: "",
        content: "",
        type: "note"
      });
      setNotes(prev => [newNote, ...prev]);
      setSelectedNoteId(newNote.id);
    } catch (err) {
      console.error("Failed to create note:", err);
    }
  };

  const handleNewAIConversation = async () => {
    try {
      const newNote = await createJournal({
        title: 'New AI Chat',
        description: 'Start a new conversation with AI',
        content: '',
        type: 'ai'
      });
      setNotes(prev => [newNote, ...prev]);
      setSelectedNoteId(newNote.id);
    } catch (err) {
      console.error("Failed to create AI conversation:", err);
    }
  };

  const handleNoteSelect = (noteId) => {
    setSelectedNoteId(noteId);
  };

  const handleNoteUpdate = (updatedNote) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === updatedNote.id ? { ...note, ...updatedNote } : note
      )
    );
  };

  const handleAuthSuccess = async (authResponse) => {
    try {
      localStorage.setItem("token", authResponse.access_token);
      const userData = await getCurrentUser();
      setUser(userData.user);
      const data = await getJournals();
      setNotes(data);
      if (data.length > 0) setSelectedNoteId(data[0].id);
      navigate("/"); // Optional if you're using routes
    } catch (err) {
      console.error('Failed to fetch notes after login:', err);
      setError('Failed to load notes');
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      setUser(null);
      setNotes([]);
      setSelectedNoteId(null);
      navigate("/");
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Failed to sign out. Please try again.');
    }
  };

  const selectedNote = notes.find(note => note.id === selectedNoteId);

  if (isLoading) {
    return (
      <div className="app loading">
        <div className="loading-spinner"></div>
        <p>Loading your dreams...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  if (error) {
    return (
      <div className="app error">
        <div className="error-message">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => setError(null)}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        notes={notes}
        selectedNoteId={selectedNoteId}
        onNoteSelect={handleNoteSelect}
        onNewNote={handleNewNote}
        onNewAIConversation={handleNewAIConversation}
        currentUser={user}
        onSignOut={handleSignOut}
      />
      <Editor
        note={selectedNote}
        onNoteUpdate={handleNoteUpdate}
      />
    </div>
  );
};

export default App;
