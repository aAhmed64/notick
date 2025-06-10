import React, { useState, useEffect } from 'react';
import { getJournals, createJournal, deleteJournal } from '../services/api';

const JournalList = ({ onSelectNote }) => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newJournalTitle, setNewJournalTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      setLoading(true);
      const data = await getJournals();
      setJournals(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch journals');
      console.error('Error fetching journals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJournal = async (e) => {
    e.preventDefault();
    if (!newJournalTitle.trim()) return;

    try {
      setIsCreating(true);
      const newJournal = await createJournal({
        title: newJournalTitle,
        description: '',
        content: ''
      });
      setJournals([...journals, newJournal]);
      setNewJournalTitle('');
      setError(null);
    } catch (err) {
      setError('Failed to create journal');
      console.error('Error creating journal:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteJournal = async (id) => {
    try {
      await deleteJournal(id);
      setJournals(journals.filter(journal => journal.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete journal');
      console.error('Error deleting journal:', err);
    }
  };

  if (loading) {
    return (
      <div className="notes-list loading">
        <div className="loading-spinner"></div>
        <p>Loading your dreams...</p>
      </div>
    );
  }

  return (
    <div className="notes-list">
      <form onSubmit={handleCreateJournal} className="new-note-form">
        <input
          type="text"
          value={newJournalTitle}
          onChange={(e) => setNewJournalTitle(e.target.value)}
          placeholder="Create a new dream..."
          className="new-note-input"
        />
        <button 
          type="submit" 
          className="create-note-btn"
          disabled={isCreating || !newJournalTitle.trim()}
        >
          {isCreating ? 'Creating...' : 'Create'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {journals.length === 0 ? (
        <div className="empty-state">
          <p>No dreams yet. Start by creating your first one!</p>
        </div>
      ) : (
        journals.map(journal => (
          <div 
            key={journal.id} 
            className="note-item"
            onClick={() => onSelectNote(journal)}
          >
            <div className="note-header">
              <h3>{journal.title || 'Untitled Dream'}</h3>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteJournal(journal.id);
                }}
              >
                ×
              </button>
            </div>
            {journal.description && (
              <p className="note-description">{journal.description}</p>
            )}
            <p className="note-preview">
              {journal.content ? journal.content.substring(0, 100) + '...' : 'No content yet'}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default JournalList;
