// Standardized API client for communicating with Express & MongoDB backend
const API_BASE = '/api';

export const authService = {
  // Check active session via HttpOnly cookie
  getCurrentUser: async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data.user || null;
    } catch (error) {
      return null;
    }
  },

  // User login
  login: async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'Invalid email or password credentials.');
    }
    return data.user;
  },

  // User registration
  register: async (name, email, password) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed. Please try again.');
    }
    return data.user;
  },

  // User logout
  logout: async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
    } catch (e) {
      // Ignore network errors on logout
    }
  },
};

export const resortService = {
  // Fetch all resorts from MongoDB backend
  getAllResorts: async () => {
    const response = await fetch(`${API_BASE}/resorts`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch resorts from server.');
    }

    const json = await response.json();
    return json.data || [];
  },

  // Fetch single resort by ID from MongoDB backend
  getResortById: async (id) => {
    const response = await fetch(`${API_BASE}/resorts/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Resort not found.');
    }

    const json = await response.json();
    return json.data;
  },

  // Safe Google Maps URL generator
  getGoogleMapsUrl: (resort) => {
    if (resort?.googleMapsUrl && resort.googleMapsUrl.trim().length > 0) {
      return resort.googleMapsUrl;
    }
    const query = encodeURIComponent(`${resort?.name || ''}, ${resort?.location || 'Kannur Kerala'}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  },
};

export const adminService = {
  // Get dashboard statistics (resort count, room count, summary list)
  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE}/admin/dashboard`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.message || 'Failed to fetch admin dashboard stats.');
      error.status = response.status;
      throw error;
    }
    return data.data;
  },

  // Get all rooms flattened across resorts
  getRooms: async () => {
    const response = await fetch(`${API_BASE}/admin/rooms`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.message || 'Failed to fetch rooms.');
      error.status = response.status;
      throw error;
    }
    return data.data || [];
  },

  // Add room under parent resort
  addRoom: async (resortId, roomData) => {
    const response = await fetch(`${API_BASE}/admin/resorts/${resortId}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(roomData),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.message || 'Failed to add room.');
      error.status = response.status;
      throw error;
    }
    return data.data;
  },

  // Update room
  updateRoom: async (resortId, roomId, roomData) => {
    const response = await fetch(`${API_BASE}/admin/resorts/${resortId}/rooms/${roomId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(roomData),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.message || 'Failed to update room.');
      error.status = response.status;
      throw error;
    }
    return data.data;
  },

  // Delete room
  deleteRoom: async (resortId, roomId) => {
    const response = await fetch(`${API_BASE}/admin/resorts/${resortId}/rooms/${roomId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.message || 'Failed to delete room.');
      error.status = response.status;
      throw error;
    }
    return data.data;
  },
};
