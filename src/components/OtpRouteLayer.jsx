import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const OtpRouteLayer = () => {
  const location = useLocation();

  // Check if email and password are present in location.state
  const hasValidState = location.state?.email && location.state?.password;

  if (!hasValidState) {
    return <Navigate to="/sign-in" replace />;
  }

  // Check if the user is already authenticated (shouldn't access OTP if already logged in)
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default OtpRouteLayer;