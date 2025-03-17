import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const idleTimeoutRef = React.useRef(null);
  const IDLE_TIMEOUT = 300000;

  const resetIdleTimer = () => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    
    idleTimeoutRef.current = setTimeout(() => {
      signOut();
    }, IDLE_TIMEOUT);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsAuthenticated(!!token);

    const events = ['mousemove', 'keydown', 'wheel', 'DOMMouseScroll', 'mouseWheel', 'mousedown', 'touchstart', 'touchmove'];
    
    events.forEach(event => {
      window.addEventListener(event, resetIdleTimer);
    });

    resetIdleTimer();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetIdleTimer);
      });
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = (token) => {
    sessionStorage.setItem("token", token);
    setIsAuthenticated(true);
    resetIdleTimer();
    navigate("/dashboard");
  };

  const signOut = () => {
    sessionStorage.removeItem("token");
    setIsAuthenticated(false);
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    navigate("/sign-in");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);