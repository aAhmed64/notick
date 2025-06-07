import React from 'react';
import JournalList from './components/JournalList';


export default function App() {
  return (
    <div className="App">
      <h1>Notick Journals</h1>
      {/* Optional: <JournalForm /> */}
      <JournalList />
    </div>
  );
}