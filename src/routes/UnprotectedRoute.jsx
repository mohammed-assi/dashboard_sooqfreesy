import { Navigate } from "react-router-dom";
import { LOCAL_STORAGE, ROUTES } from "../app/constants";

const UnprotectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
  return !isAuthenticated ? children : <Navigate to={ROUTES.dashboard} replace />;
};

export default UnprotectedRoute;
