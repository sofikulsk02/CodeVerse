import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const checkAuthState = () => {
    try {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        setIsLoading(false);
        return;
      }

      // Validate JwT token forma
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.log('⚠️ Invalid token format, clearing storage');
        clearAuthData();
        setIsLoading(false);
        return;
      }
//this is initial 
      try {
        atob(tokenParts[0]); // header
        atob(tokenParts[1]); // payload
      } catch (error) {
        console.log('⚠️ Token contains invalid base64, clearing storage');
        clearAuthData();
        setIsLoading(false);
        return;
      }
      
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        console.log('✅ Auth state restored:', { email: parsedUser.email, role: parsedUser.role });
      } catch (parseError) {
        console.error('Error parsing user data:', parseError);
        clearAuthData();
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 AuthContext login attempt:', { email });
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('🔍 Login response status:', response.status);
      const data = await response.json();
      console.log('🔍 Login response data:', data);

      if (data.success && data.user && data.token) {
        const tokenParts = data.token.split('.');
        if (tokenParts.length !== 3) {
          console.error('❌ Received invalid token format from server');
          return { success: false, message: 'Invalid token received from server' };
        }

        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
        
        console.log('✅ Login successful, token stored');
        return { success: true, user: data.user };
      } else {
        console.error('❌ Login failed:', data.message);
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  };

  const logout = () => {
    clearAuthData();
    console.log('🚪 User logged out');
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    isAdmin: user?.role === 'admin',
    isMentor: user?.role === 'mentor',
    isStudent: user?.role === 'student',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;