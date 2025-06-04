import React, { useEffect, useState } from 'react';
import { getJournals } from '../services/api';
import JournalItem from './JournalItem';
import JournalForm from './JournalForm';

export default function JournalList() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getJournals();
      setJournals(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  function handleAdd(newJournal) {
    setJournals(prev => [newJournal, ...prev]);
  }

  function handleDelete(deletedId) {
    setJournals(prev => prev.filter(journal => journal.id !== deletedId));
  }

  if (loading) return <p>Loading journals...</p>;

  return (
    <div>
      <h2>Notick Journals</h2>
      <JournalForm onAdd={handleAdd} />
      {journals.length === 0 ? (
        <p>No journal entries yet.</p>
      ) : (
        journals.map(journal => (
          <JournalItem
            key={journal.id}
            journal={journal}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}
