import {
  useContext,
  useState,
  createContext,
  useEffect,
  useLayoutEffect,
} from "react";

import axios from "axios";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userDetails, setUserDetails] = useState({
    email: null,
    role: null,
    firstName: null,
    lastName: null,
    token: null
  });

  const login = async (email, password, role) => {
    const mockUserData = {
      email,
      role,
      firstName: "Test",
      lastName: "User",
      token: "mock-jwt-token" 
    };

    setIsAuthenticated(true);
    setUserRole(role);
    setUserDetails(mockUserData);
    
    return mockUserData;
  };

  const register = async (userData) => {
    const mockUserData = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      token: "mock-jwt-token" 
    };

    setIsAuthenticated(true);
    setUserRole(userData.role);
    setUserDetails(mockUserData);

    return mockUserData;
  };
  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserDetails({
      email: null,
      role: null,
      firstName: null,
      lastName: null,
      token: null
    });
  };


  /*
    if token defined, add it to authorization headers.
  */
  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && isAuthenticated && userDetails?.token
          ? `Bearer ${userDetails.token}`
          : config.headers.Authorization;
      return config;
    });

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [isAuthenticated, userDetails?.token]);

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
            setUserDetails((prev) => ({ ...prev, token: accessToken }));
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            originalRequest._retry = true;
            return api(originalRequest);
          } catch {
            logout(); // Use the logout function to reset all auth state
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, []);
  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      userRole,
      userDetails,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};
