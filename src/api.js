// API client for Fitness_App_Backend
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// Token management
const TOKEN_KEY = 'fitness_app_token';
const USER_KEY = 'fitness_app_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getUser() {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

export function setUser(user) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  // Only add body if it exists and is not FormData
  if (options.body && !(options.body instanceof FormData)) {
    if (typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    } else {
      config.body = options.body;
    }
  }

  try {
    const res = await fetch(url, config);
    
    // Handle unauthorized - token might be invalid
    if (res.status === 401) {
      clearAuth();
      throw new Error('Authentication required');
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: `Request failed: ${res.status}` }));
      
      // Handle validation errors
      if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
        const errorMessages = errorData.errors.map(err => err.msg || err.message || 'Validation error').join(', ');
        throw new Error(errorMessages);
      }
      
      throw new Error(errorData.message || `Request failed: ${res.status}`);
    }

    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    }
    
    return null;
  } catch (error) {
    if (error instanceof Error) {
      // Check if it's a network error (fetch failed)
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error(`Unable to connect to backend at ${API_BASE_URL}. Please ensure the backend server is running and accessible.`);
      }
      throw error;
    }
    throw new Error('Network error occurred');
  }
}

// Authentication API
export async function register(email, password, profileData) {
  try {
    // Backend expects profile data nested under "profile" key
    const requestBody = {
      email,
      password,
      profile: profileData // Wrap profile fields (firstName, lastName, etc.) in a profile object
    };
    
    const response = await request('/api/auth/register', {
      method: 'POST',
      body: requestBody
    });
    
    if (response.success && response.token) {
      setToken(response.token);
      setUser(response.user);
    }
    
    return response;
  } catch (error) {
    // Re-throw with more context
    console.error('Registration error:', error);
    throw error;
  }
}

export async function login(email, password) {
  const response = await request('/api/auth/login', {
    method: 'POST',
    body: { email, password }
  });
  
  if (response.success && response.token) {
    setToken(response.token);
    setUser(response.user);
  }
  
  return response;
}

export async function logout() {
  clearAuth();
  return { success: true, message: 'Logged out successfully' };
}

export async function getCurrentUser() {
  const response = await request('/api/auth/me', {
    method: 'GET'
  });
  
  if (response.success && response.user) {
    setUser(response.user);
  }
  
  return response;
}

// Profile API
export async function getProfile() {
  return request('/api/profile', {
    method: 'GET'
  });
}

export async function updateProfile(profile) {
  return request('/api/profile', {
    method: 'PUT',
    body: { profile }
  });
}

// Legacy function for backward compatibility
export async function saveProfile(profile) {
  try {
    return await updateProfile(profile);
  } catch (error) {
    console.error('Error saving profile:', error);
    return null;
  }
}

// Workouts API
export async function getWorkouts(params = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  if (params.workoutType) queryParams.append('workoutType', params.workoutType);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.page) queryParams.append('page', params.page);
  
  const queryString = queryParams.toString();
  const path = `/api/workouts${queryString ? `?${queryString}` : ''}`;
  
  return request(path, {
    method: 'GET'
  });
}

export async function getWorkout(id) {
  return request(`/api/workouts/${id}`, {
    method: 'GET'
  });
}

export async function createWorkout(workoutData) {
  return request('/api/workouts', {
    method: 'POST',
    body: workoutData
  });
}

export async function updateWorkout(id, workoutData) {
  return request(`/api/workouts/${id}`, {
    method: 'PUT',
    body: workoutData
  });
}

export async function deleteWorkout(id) {
  return request(`/api/workouts/${id}`, {
    method: 'DELETE'
  });
}

// Legacy functions for backward compatibility
export async function saveWorkoutPlan(payload) {
  try {
    // Map old structure to new structure if needed
    const workoutData = {
      title: payload.title || payload.name || 'Workout Plan',
      workoutType: payload.type || payload.workoutType || 'other',
      duration: payload.duration || 60,
      date: payload.date || new Date().toISOString(),
      ...payload
    };
    
    return await createWorkout(workoutData);
  } catch (error) {
    console.error('Error saving workout plan:', error);
    return null;
  }
}

// Workout Day Inputs API - Save exercise inputs for training days
export async function getWorkoutDayInputs() {
  return request('/api/profile/workout-day-inputs', {
    method: 'GET'
  });
}

export async function saveWorkoutDayInputs(inputs) {
  // Inputs should be an object like: { "Week 1 - Day 1 (Push)": { "0": {weight: "...", notes: "..."}, ... } }
  return request('/api/profile/workout-day-inputs', {
    method: 'PUT',
    body: { inputs }
  });
}

export async function saveWorkoutDayExerciseInput(dayLabel, exerciseIdx, weight, notes) {
  return request('/api/profile/workout-day-inputs', {
    method: 'PUT',
    body: { dayLabel, exerciseIdx, weight, notes }
  });
}

export async function saveWorkoutEntry(entry) {
  try {
    // If entry has dayLabel and exercise information, save to workout day inputs
    if (entry.dayLabel !== undefined) {
      // Extract exercise index - check multiple possible fields
      const exerciseIdx = entry.exerciseIdx !== undefined 
        ? entry.exerciseIdx 
        : (entry.idx !== undefined ? entry.idx : 0);
      
      // Try to save to workout day inputs
      try {
        const result = await saveWorkoutDayExerciseInput(
          entry.dayLabel,
          exerciseIdx,
          entry.weight || '',
          entry.notes || ''
        );
        if (result?.success) {
          return result;
        }
      } catch (err) {
        console.error('Error saving to workout day inputs, falling back to workout entry:', err);
      }
    }
    
    // Fallback to creating a workout entry (backward compatibility)
    const workoutData = {
      title: entry.title || entry.name || 'Workout Entry',
      workoutType: entry.type || entry.workoutType || 'other',
      duration: entry.duration || 60,
      date: entry.date || new Date().toISOString(),
      ...entry
    };
    
    return await createWorkout(workoutData);
  } catch (error) {
    console.error('Error saving workout entry:', error);
    return null;
  }
}

// Utility function
export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function isAuthenticated() {
  return !!getToken();
}

// Test backend connection
export async function testConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return { connected: true, status: response.status };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}
