import axios from 'axios';

const API_BASE_URL = `http://${window.location.hostname}:3090`;
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let accessToken = null;
let logoutCallback = null;
let isLoggedOut = false;

let refreshTokenFailed = false;

export function didRefreshFail() {
  return refreshTokenFailed;
}

export function setAccessToken(token) {
  accessToken = token;
}

export function setLogoutCallback(callback) {
  logoutCallback = callback;
}

export function markAsLoggedOut() {
  isLoggedOut = true;
}

export async function logout() {
  try {
    await api.post('/auth/logout');
  } catch (err) {
    console.error('Logout failed', err);
  } finally {
    accessToken = null;
    isLoggedOut = true;
  }
}

api.interceptors.request.use((config) => {
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const csrfToken = getCookie('csrfToken');
  if (csrfToken) {
    config.headers['x-csrf-token'] = csrfToken;
  }

  return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;
  
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes('/auth/refresh') &&
        !isLoggedOut
      ) {
        originalRequest._retry = true;
  
        try {
          const res = await api.get('/auth/refresh');
  
          accessToken = res.data.accessToken;
          setAccessToken(accessToken);
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (err) {
          if (err.response?.status === 401) {
            console.warn('Refresh failed: not logged in');
            refreshTokenFailed = true;
          } else {
            console.warn('Refresh failed for other reason:', err.response?.status);
          }
  
          isLoggedOut = true;
          if (logoutCallback) {
            setTimeout(() => logoutCallback(), 0);
          }
          
        }
      }
  
      return Promise.reject(error);
    }
  );
  

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export default api;
