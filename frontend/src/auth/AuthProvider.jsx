import {
  useContext,
  useState,
  createContext,
  useEffect,
  useLayoutEffect,
} from "react";

import axios from "axios";
const AuthContext = createContext(undefined);

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return authContext;
};

const api = axios.create({
  baseURL: "Somewhere",
});

/*
handles setting authorizatoi headers when we have a token
handles refreshing tokens when we get an unauthorized response from server.
*/
export const AuthProvider = ({ children }) => {
  // we might call an api and get the token, and do setToken
  //  (in some other component like the login page or somethiing)
  const [token, setToken] = useState();

  // get token from api
  useEffect(() => {
    const fetchMe = async () => {
      try {
        // TODO: FETCH TOKEN FROM API
        // if we have a valid token, it will be in the
        //  authorizaiton headers so we could extract from there on the server
        setToken("token");
      } catch {
        setToken(null);
      }
    };
    fetchMe();
  }, []);

  /*
    if token defined, add it to authorization headers.
    useLayoutEffect instread of useEffect because useLayoutEffect
        is blocking (synchronous), we dont want to render components that need auth
        until we get the new token.
  */
  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;
      return config;
    });

    /*
      cleanup - avoid stacking interceptors
      React automatically calls functions returned from useEffect
    */
    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

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
          error.response.status === 403 &&
          error.response.data.message === "Unauthorized"
        ) {
          try {
            // try to refresh token
            // TODO: HIT REFRESH TOKEN ENDPOINT
            const accessToken = "Token";
            setToken(accessToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            originalRequest._retry = true;
            // retry with original request
            return api(originalRequest);
          } catch {
            //error getting refresh token (proably expired), go to login page.
            setToken(null);
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
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
