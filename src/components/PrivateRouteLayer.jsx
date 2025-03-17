import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRouteLayer = () => {
  const { isAuthenticated } = useAuth();
  const token = sessionStorage.getItem("token");

  console.log("PrivateRouteLayer - Is Authenticated:", isAuthenticated);

  const isTokenValid = typeof token === "string" && token.trim() !== "";

  if (!isAuthenticated || !isTokenValid) {
    if (token) {
      sessionStorage.removeItem("token");
    }
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
};

export default PrivateRouteLayer;