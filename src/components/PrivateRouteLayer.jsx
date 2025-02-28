import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRouteLayer = () => {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem("token");

  console.log("PrivateRouteLayer - Token:", token);
  console.log("PrivateRouteLayer - Is Authenticated:", isAuthenticated);

  // Basic token validation: ensure it's a non-empty string
  const isTokenValid = typeof token === "string" && token.trim() !== "";

  if (!isAuthenticated || !isTokenValid) {
    // Clear invalid token if present
    if (token) {
      localStorage.removeItem("token");
    }
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
};

export default PrivateRouteLayer;