import React, { useEffect } from "react";
import Routers from "./routes/Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import 'react-quill/dist/quill.snow.css';
import { useLocation } from "react-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
const App = () => {
  const location = useLocation();
  useEffect(() => {
    NProgress.start();
    NProgress.configure({
      showSpinner: false,
    });
    const timer = setTimeout(() => {
      NProgress.done();
    }, 400);
    return () => {
      clearTimeout(timer);
    };
  }, [location]);
  return (
    <div>
      <Routers />
      <ToastContainer />
    </div>
  );
};

export default App;
