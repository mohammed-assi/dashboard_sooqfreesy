import { Navigate } from "react-router-dom";
import { LOCAL_STORAGE, ROUTES } from "../app/constants";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
  return isAuthenticated ? children : <Navigate to={ROUTES.login} replace />;
};

export default ProtectedRoute;
