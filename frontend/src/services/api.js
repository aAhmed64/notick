const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const handleResponse = async (response) => {
  if (!response.ok) {
    // This is a robust way to get the error message from the server's JSON response
    const error = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  // If the response is OK, parse it as JSON
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
    credentials: 'include', // Important for sessions/cookies
  };
  return fetch(url, config);
};

export async function getJournals() {
  try {
    const res = await fetchWithConfig(`${API_URL}/api/journals`);
    return await handleResponse(res);
  } catch (error) {
    console.error('Fetch journals error:', error);
    // Return an empty array so the UI doesn't crash
    return [];
  }
}

// =======================================================
// THIS IS THE CORRECTED FUNCTION
// =======================================================
export async function createJournal(data) {
  try {
    console.log('Creating journal at:', `${API_URL}/api/journals`);
    const res = await fetchWithConfig(`${API_URL}/api/journals`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    // FIX: Use the shared handler for consistency and proper error handling.
    return await handleResponse(res);
  } catch (error) {
    console.error('Create journal error:', error);
    // Re-throw the error so the component's catch block can handle it (e.g., show an error message)
    throw error;
  }
}
// =======================================================

export async function updateJournal(id, data) {
  try {
    const res = await fetchWithConfig(`${API_URL}/api/journals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Update journal error:', error);
    throw error;
  }
}

export async function deleteJournal(id) {
  try {
    const res = await fetchWithConfig(`${API_URL}/api/journals/${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Delete journal error:', error);
    throw error;
  }
}

export const login = async (credentials) => {
  const response = await fetchWithConfig(`${API_URL}/api/login`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const register = async (userData) => {
  const response = await fetchWithConfig(`${API_URL}/api/register`, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const logout = async () => {
  const response = await fetchWithConfig(`${API_URL}/api/logout`, {
    method: 'POST',
  });
  return handleResponse(response);
};

export const getCurrentUser = async () => {
  const response = await fetchWithConfig(`${API_URL}/api/me`);
  return handleResponse(response);
};