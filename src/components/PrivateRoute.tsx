import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Display a loading spinner or message while checking authentication
  }

  if (error) {
    console.error("Error fetching authentication state:", error);
    return <div>Error loading authentication state. Please try again later.</div>;
  }

  if (!user) {
    // Redirect to the login page and preserve the attempted path
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
