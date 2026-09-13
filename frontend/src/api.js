import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'admin_token';

const client = axios.create({ baseURL: BASE_URL });

// Attach the admin JWT (if we have one) to every request. Public GET
// endpoints ignore the header; admin routes require it.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token has expired or is invalid, drop it so the UI falls back
// to the login screen instead of silently failing.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

// ---- Public site content ----
export const getProfile = () => client.get('/profile').then((r) => r.data);
export const getProjects = () => client.get('/projects').then((r) => r.data);
// export const getResume = () => client.get('/resume').then((r) => r.data);
export const sendContactMessage = (payload) => client.post('/contact', payload).then((r) => r.data);

// ---- Auth ----
export const login = (username, password) =>
  client.post('/auth/login', { username, password }).then((r) => r.data);

export const isLoggedIn = () => Boolean(localStorage.getItem(TOKEN_KEY));
export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const logout = () => localStorage.removeItem(TOKEN_KEY);

// ---- Admin: profile ----
export const adminUpdateProfile = (payload) => client.put('/admin/profile', payload).then((r) => r.data);

// ---- Admin: projects ----
export const adminGetProjects = () => client.get('/admin/projects').then((r) => r.data);
export const adminCreateProject = (payload) => client.post('/admin/projects', payload).then((r) => r.data);
export const adminUpdateProject = (id, payload) =>
  client.put(`/admin/projects/${id}`, payload).then((r) => r.data);
export const adminDeleteProject = (id) => client.delete(`/admin/projects/${id}`).then((r) => r.data);

// ---- Admin: resume ----
// export const adminGetResume = () => client.get('/admin/resume').then((r) => r.data);
// export const adminCreateResumeEntry = (payload) => client.post('/admin/resume', payload).then((r) => r.data);
// export const adminUpdateResumeEntry = (id, payload) =>
//   client.put(`/admin/resume/${id}`, payload).then((r) => r.data);
// export const adminDeleteResumeEntry = (id) => client.delete(`/admin/resume/${id}`).then((r) => r.data);

// ---- Admin: image upload ----
export const adminUploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return client
    .post('/admin/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data);
};

// ---- Admin: contact messages ----
export const adminGetMessages = () => client.get('/admin/messages').then((r) => r.data);
export const adminDeleteMessage = (id) => client.delete(`/admin/messages/${id}`).then((r) => r.data);

export const getWritingsByCategory = (category) => client.get(`/writings/${category}`).then((r) => r.data);
export const getWriting = (category, id) => client.get(`/writings/${category}/${id}`).then((r) => r.data);

// ---- Admin: writings ----
export const adminGetWritings = () => client.get('/admin/writings').then((r) => r.data);
export const adminCreateWriting = (payload) => client.post('/admin/writings', payload).then((r) => r.data);
export const adminUpdateWriting = (id, payload) =>
  client.put(`/admin/writings/${id}`, payload).then((r) => r.data);
export const adminDeleteWriting = (id) => client.delete(`/admin/writings/${id}`).then((r) => r.data);

export const sendChatMessage = (message, history) =>
  client.post('/chat', { message, history }).then((r) => r.data);

export default client;
