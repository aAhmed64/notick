const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function getJournals() {
  try {
    const res = await fetch(API_BASE_URL);  // GET all journals
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

export async function createJournal(data) {
  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateJournal(id, data) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {  // PUT /api/journals/:id
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteJournal(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {  // DELETE /api/journals/:id
    method: 'DELETE',
  });
  return res.json();
}

