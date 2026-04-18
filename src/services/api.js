import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 180000,
});

// ─────────────────────────────────────────
// Get token from localStorage
// ─────────────────────────────────────────
export const getToken = () => {
  try {
    const user = localStorage.getItem(
      'renovisionUser'
    );
    if (user) {
      const parsed = JSON.parse(user);
      return parsed.token || null;
    }
    return null;
  } catch (e) {
    return null;
  }
};

// ─────────────────────────────────────────
// Check if user is logged in
// ─────────────────────────────────────────
export const isLoggedIn = () => {
  try {
    const user = localStorage.getItem(
      'renovisionUser'
    );
    if (!user) return false;
    const parsed = JSON.parse(user);
    return !!parsed.token;
  } catch (e) {
    return false;
  }
};

// ─────────────────────────────────────────
// Register new user
// ─────────────────────────────────────────
export const registerUser = async (
  name, email, password
) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', password);

  const response = await api.post(
    '/auth/register', formData
  );
  return response.data;
};

// ─────────────────────────────────────────
// Login user
// ─────────────────────────────────────────
export const loginUser = async (
  email, password
) => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  const response = await api.post(
    '/auth/login', formData
  );
  return response.data;
};

// ─────────────────────────────────────────
// Google OAuth login
// ─────────────────────────────────────────
export const googleAuthLogin = async (
  name, email, googleUid
) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('google_uid', googleUid);

  const response = await api.post(
    '/auth/google', formData
  );
  return response.data;
};

// ─────────────────────────────────────────
// Analyze room image
// ─────────────────────────────────────────
export const analyzeRoom = async (
  imageFile, budget, style,
  userPrompt = ""
) => {
  const token = getToken();

  console.log('Token found:', token
    ? 'YES' : 'NO');

  if (!token) {
    throw new Error(
      'Not logged in. Please login again.'
    );
  }

  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('budget', String(budget));
  formData.append('style', style);
  formData.append('token', token);
  formData.append('user_prompt',
    userPrompt || "");

  console.log('Sending analyze request...');
  console.log('Budget:', budget);
  console.log('Style:', style);
  console.log('Prompt:', userPrompt);

  const response = await api.post(
    '/analyze', formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return response.data;
};

// ─────────────────────────────────────────
// Get recommendations
// ─────────────────────────────────────────
export const getRecommendations = async (
  roomType, furniture, budget, style
) => {
  const formData = new FormData();
  formData.append('room_type', roomType);
  formData.append(
    'furniture', furniture.join(',')
  );
  formData.append('budget', budget);
  formData.append('style', style);

  const response = await api.post(
    '/recommend', formData
  );
  return response.data;
};

export default api;