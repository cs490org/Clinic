import {
  useContext,
  useState,
  createContext,
  useEffect,
  useLayoutEffect,
} from "react";

import axios from "axios";
import { CircularProgress } from "@mui/material";
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
};

const api = axios.create({
  baseURL: "Somewhere",
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      
      const mockUser = {
        id: "123",
        email: credentials.email,
        firstName: "Test",
        lastName: "User",
        role: credentials.role,
        img_uri: null, // profile image? 
      };

      // TODO: HIT LOGIN ENDPOINT
      const mockResponse = {
        token: "mock-jwt-token",
        user: mockUser
      };

      localStorage.setItem('token', mockResponse.token);
      
      setUser(mockResponse.user);
      setIsAuthenticated(true);

      return mockResponse.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        img_uri: null, 
      };

      // TODO: HIT REGISTER ENDPOINT
      const mockResponse = {
        token: "mock-jwt-token",
        user: mockUser
      };

      localStorage.setItem('token', mockResponse.token);
      
      setUser(mockResponse.user);
      setIsAuthenticated(true);

      return mockResponse.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoading(true);
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  // const updateProfile = async (updates) => {
  //   try {
  //     const updatedUser = {
  //       ...user,
  //       ...updates
  //     };
  //     setUser(updatedUser);
  //     return updatedUser;
  //   } catch (error) {
  //     console.error('Profile update error:', error);
  //     throw error;
  //   }
  // };

  // token verification on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          
          // TODO: HIT VERIFY TOKEN ENDPOINT
          setUser({
            id: "123",
            email: "test@example.com",
            firstName: "Test",
            lastName: "User",
            role: "PATIENT",
            img_uri: null
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token'); // Clear invalid token
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /*
    if token defined, add it to authorization headers.
  */
  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && isAuthenticated && user?.token
          ? `Bearer ${user.token}`
          : config.headers.Authorization;
      return config;
    });

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [isAuthenticated, user?.token]);

  /**
   * If unauthorized status code, refrehs token.
   * if that fails, send to login.
   */
  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 403 &&
          error.response?.data?.message === "Unauthorized"
        ) {
          try {
            // TODO: HIT REFRESH TOKEN ENDPOINT
            const accessToken = "mock-jwt-token";
            setIsAuthenticated(true);
            setUser((prev) => ({ ...prev, token: accessToken }));
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            originalRequest._retry = true;
            return api(originalRequest);
          } catch {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  const value = {
    user,            
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    // updateProfile   // updating profile (including img_uri)
  };

  // prevent rendering until auth is initialized
  // ie, we dont want to access undefined user data
  if (isLoading) {
    return <CircularProgress></CircularProgress>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
