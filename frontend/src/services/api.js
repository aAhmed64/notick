const API_BASE_URL = "https://c056-154-236-11-112.ngrok-free.app/api/journals";

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const fetchWithConfig = async (url, options = {}) => {
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    mode: 'cors',
    credentials: 'include',
  };
  return fetch(url, config);
};

export async function getJournals() {
  try {
    console.log('Fetching from:', API_BASE_URL); // Debug log
    const res = await fetchWithConfig(API_BASE_URL);
    return await handleResponse(res);
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

export async function createJournal(data) {
  try {
    console.log('Creating journal at:', API_BASE_URL); // Debug log
    const res = await fetchWithConfig(API_BASE_URL, {
      method: 'POST',
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
    console.log('Updating journal at:', `${API_BASE_URL}/${id}`); // Debug log
    const res = await fetchWithConfig(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
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
    console.log('Deleting journal at:', `${API_BASE_URL}/${id}`); // Debug log
    const res = await fetchWithConfig(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}

