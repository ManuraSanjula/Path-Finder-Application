import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "./auth"; // Ensure the path is correct

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
