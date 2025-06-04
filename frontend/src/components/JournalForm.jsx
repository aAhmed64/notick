import React, { useState } from 'react';
import { createJournal } from '../services/api';

export default function JournalForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newJournal = await createJournal({ title, content });
      onAdd(newJournal);
      setTitle('');
      setContent('');
    } catch (err) {
      setError('Failed to add journal');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Journal'}
      </button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </form>
  );
}
