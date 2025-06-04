import React from 'react';
import { deleteJournal } from '../services/api';

export default function JournalItem({ journal, onDelete }) {
  const handleDelete = async () => {
    try {
      await deleteJournal(journal.id);
      onDelete(journal.id); // Tell parent to remove it from state
    } catch (error) {
      console.error("Failed to delete journal:", error);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
      <h3>{journal.title}</h3>
      <p>{journal.content}</p>
      <button onClick={handleDelete} style={{ color: 'red' }}>Delete</button>
    </div>
  );
}
