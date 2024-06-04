/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { isTokenExpired } from "../functions/isTokenExpired";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = token && !isTokenExpired(token);

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
