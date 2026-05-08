import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
// simple util to safely decode jwt payload without external library
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser({ id: decoded.user_id, role: decoded.role, username: decoded.username });
      } else {
        // expired
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await API.post('auth/login/', { username, password });
      const { access, refresh } = res.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      const decoded = decodeJWT(access);
      setUser({ id: decoded.user_id, role: decoded.role, username: decoded.username });
      return { success: true };
    } catch (err) {
      return { success: false, error: "Identifiants invalides." };
    }
  };

  const register = async (userData) => {
    try {
      await API.post('auth/register/', userData);
      // Auto-login after register
      return await login(userData.username, userData.password);
    } catch (err) {
      return { success: false, error: "L'inscription a échoué. Veuillez vérifier vos informations." };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
