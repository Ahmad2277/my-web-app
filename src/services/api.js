import axios from 'axios';

const BASE_URL =
  'https://ahmad3351-renovision.hf.space';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 180000,
});

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

export const analyzeRoom = async (
  imageFile, budget, style,
  userPrompt = ""
) => {
  const token = getToken();

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
  formData.append(
    'user_prompt', userPrompt || ""
  );

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

export default api;