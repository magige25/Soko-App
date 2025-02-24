import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRouteLayer = () => {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  console.log("PrivateRouteLayer - Token:", token);
  console.log("PrivateRouteLayer - Is Authenticated:", isAuthenticated);

  return token ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

export default PrivateRouteLayer;