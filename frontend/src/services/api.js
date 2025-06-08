const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export async function getJournals() {
  try {
    const res = await fetch(API_BASE_URL);
    return await handleResponse(res);
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

export async function createJournal(data) {
  try {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Create error:', error);
    throw error;
  }
}

export async function updateJournal(id, data) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Update error:', error);
    throw error;
  }
}

export async function deleteJournal(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}

