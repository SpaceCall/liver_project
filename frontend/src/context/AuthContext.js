import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api, {
  setAccessToken,
  setLogoutCallback,
  markAsLoggedOut,
  didRefreshFail,
  logout as apiLogout,
} from '../api/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logoutInProgress = useRef(false);

  const logout = useCallback(async () => {
    if (logoutInProgress.current) return;
    logoutInProgress.current = true;

    markAsLoggedOut();
    await apiLogout();
    setAccessToken(null);
    setUser(null);
    navigate('/login', { state: { reason: 'expired' } });

    setTimeout(() => {
      logoutInProgress.current = false;
    }, 1000);
  }, [navigate]);


  const login = async (token = null) => {
    if (token) setAccessToken(token);
    try {
      const res = await api.get('/auth/me');
      const userData = res.data;
      userData.role = userData.IsAdmin ? 'admin' : 'doctor';
      setUser(userData);
    } catch (err) {
      if (didRefreshFail()) {
        console.warn('Skip logout, refresh token already failed');
      } else {
        console.warn('Login failed:', err);
        logout();
      }
    }
  };

  useEffect(() => {
    setLogoutCallback(logout);

    (async () => {
      try {
        const res = await api.get('/auth/me');
        const userData = res.data;
        userData.role = userData.IsAdmin ? 'admin' : 'doctor';
        setUser(userData);
      } catch (err) {
        if (err.response?.status === 401) {
          console.log('No session to restore');
        } else if (!err.response) {
          console.warn('Network/server error during session restore');
        } else {
          console.error('Unexpected error during session restore:', err.response?.status);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
