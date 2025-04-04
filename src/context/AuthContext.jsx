import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem("token"));
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  const idleTimeoutRef = React.useRef(null);
  const IDLE_TIMEOUT = 600000;

  const resetIdleTimer = () => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    
    idleTimeoutRef.current = setTimeout(() => {
      signOut();
    }, IDLE_TIMEOUT);
  };

  const fetchUserData = async (userId, token) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.bizchain.co.ke/v1/user/system/${userId}`,
        {
          headers: {
            "APP-KEY": "BCM8WTL9MQU4MJLE",
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      if (response.status === 200 && response.data.status?.code === 0) {
        const userData = response.data.data;
        setUser({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: userData.role?.name || userData.role,
        });
      } else {
        console.error("Failed to fetch user data:", response.data);
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message, error.response?.data);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");

    setIsAuthenticated(!!token);

    if (token && userId && !user) { 
      fetchUserData(userId, token);
    }

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
  }, [user]); 

  const signIn = (token, userId) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("userId", userId); 
    setIsAuthenticated(true);
    fetchUserData(userId, token); 
    resetIdleTimer();
    navigate("/dashboard");
  };

  const signOut = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId"); 
    setIsAuthenticated(false);
    setUser(null);
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    navigate("/sign-in");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);