import React, { createContext, useState, useEffect } from 'react';
import useAxios from '../hooks/useAxios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUserInfo = localStorage.getItem('userInfo');

      if (storedToken && storedUserInfo) {
        try {
          setUser(JSON.parse(storedUserInfo));
          // Optionally sync with backend profile to make sure token is valid
          const { data } = await useAxios.get('/api/auth/profile');
          setUser(data);
          localStorage.setItem('userInfo', JSON.stringify(data));
        } catch (err) {
          console.error("Token sync failed", err);
          logout();
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const { data } = await useAxios.post('/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role
      }));
      return true;
    } catch (err) {
      console.error("Login error detail:", err);
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
      return false;
    }
  };

  const signup = async (name, email, password, role) => {
    setError(null);
    try {
      const { data } = await useAxios.post('/api/auth/signup', { name, email, password, role });
      setUser(data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role
      }));
      return true;
    } catch (err) {
      console.error("Signup error detail:", err);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, setError, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
