import React from 'react';

const Sidebar = ({
  isOpen,
  onToggle,
  notes,
  selectedNoteId,
  onNoteSelect,
  onNewNote,
  onNewAIConversation,
  currentUser,
  onSignOut
}) => {
  const renderNotes = (type, title) => {
    const filtered = notes.filter(note => note.type === type || (type === 'ai_chat' && note.type === 'ai'));
    if (filtered.length === 0) return null;

    return (
      <div className="notes-group">
        <h4 className="group-title">{title}</h4>
        {filtered.map(note => (
          <div
            key={note.id}
            className={`note-item ${selectedNoteId === note.id ? 'selected' : ''}`}
            onClick={() => onNoteSelect(note.id)}
          >
            <h3>{note.title || (type === 'ai_chat' ? 'Untitled AI Chat' : 'Untitled')}</h3>
            {note.description && <p>{note.description}</p>}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <img src="/what.png" alt="Notick Logo" className="logo" />
          <button className="toggle-btn" onClick={onToggle}>
            &lt;
          </button>
        </div>

        <div className="action-buttons">
          <button className="action-btn new-note-btn" onClick={onNewNote} title="Create a new note">
            +
          </button>
          <button className="action-btn new-ai-btn" onClick={onNewAIConversation} title="Start a new AI chat">
            🤖
          </button>
        </div>

        <div className="notes-list">
          {renderNotes('note', 'Your Notes')}
          {renderNotes('ai_chat', 'AI Chats')}
        </div>

        <div className="user-profile">
          <div className="user-info">
            <div className="user-avatar">
              {(currentUser?.username?.[0] || currentUser?.email?.[0] || 'U').toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-email">{currentUser?.email || 'User'}</span>
            </div>
          </div>
          <button className="sign-out-btn" onClick={onSignOut}>
            Sign Out
          </button>
        </div>
      </div>

      <button
        className="toggle-btn floating"
        onClick={onToggle}
        style={{ display: isOpen ? 'none' : 'flex' }}
        title="Open Sidebar"
      >
        &gt;
      </button>
    </>
  );
};

export default Sidebar;
