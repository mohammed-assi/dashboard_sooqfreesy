import React from "react";
import { Navigate } from "react-router-dom";
import { LOCAL_STORAGE, ROUTES } from "../app/constants";

const RootRedirect = () => {
  const isAuthenticated = !!localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
  return isAuthenticated ? (
    <Navigate to={ROUTES.dashboard} replace />
  ) : (
    <Navigate to={ROUTES.login} replace />
  );
};

export default RootRedirect;
