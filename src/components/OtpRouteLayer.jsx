import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const OtpRouteLayer = () => {
  const location = useLocation();

  const hasValidState = location.state?.email && location.state?.password;

  if (!hasValidState) {
    return <Navigate to="/sign-in" replace />;
  }
  const token = sessionStorage.getItem("token");
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default OtpRouteLayer;