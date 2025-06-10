import React, { useState, useEffect } from "react";
import Sidebar from './components/Sidebar';
import Editor from './components/editor';
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

  useEffect(() => {
    const initialize = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData?.user) {
          setUser(userData.user);
          const data = await getJournals();
          setNotes(data);
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

  const handleNewAIConversation = () => {
    const newNote = {
      id: Date.now(),
      title: 'New AI Chat',
      description: 'Start a new conversation with AI',
      content: '',
      type: 'ai',
      createdAt: new Date().toISOString()
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
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

  const handleAuthSuccess = async (userData) => {
    try {
      setUser(userData.user); // Must call this first to show sidebar/editor
      const data = await getJournals();
      setNotes(data);
    } catch (err) {
      console.error('Failed to fetch notes after login:', err);
      setError('Failed to load notes');
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
      setNotes([]);
      setSelectedNoteId(null);
    } catch (error) {
      console.error('Logout failed:', error);
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
