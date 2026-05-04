import React, { useState } from "react";
import PageMeta from "../../../common/PageMeta";
import { ROUTES, TITLES } from "../../../app/constants";
import { Link, useNavigate } from "react-router";
import loginBg from "../../../assets/images/bg-login.jpg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../redux/actions/authActions";
import logo from "../../../assets/images/headerLogo.svg";

const Schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const formOptions = { resolver: yupResolver(Schema) };
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [toggle, setToggle] = useState(true);
  const [loginError, setLoginError] = useState(null);

  const handlepass = () => {
    setToggle(!toggle);
  };

  const onSubmit = async (formData) => {
    const { email, password } = formData;
    try {
      await dispatch(login({ email, password })).unwrap();
      reset();
      navigate(ROUTES.dashboard);
    } catch (error) {
      console.error("Login failed:", error);
      // Handle API error message
      setLoginError(
        error?.message ||
        error?.data?.message ||
        "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <>
      <PageMeta title={TITLES?.login} description="Login" />

      <div
        className="min-h-screen flex justify-center items-center bg-gradient-to-br from-sky-50 via-white to-sky-100 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        <div className="p-8 w-full sm:w-96 bg-white rounded-xl shadow-md border border-gray-200">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="SouqSyria Logo" className="h-12 object-contain" />
          </div>

          <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Login
          </h1>

          {/* Global Login Error Message */}
          {loginError && (
            <div className="text-red-500 text-sm text-center mb-4">
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-gray-700 py-2">Email</label>
              <input
                {...register("email")}
                type="email"
                id="email"
                placeholder="Email"
                className={`w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                autoComplete="off"
                onChange={() => setLoginError(null)}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email?.message}
                </p>
              )}
            </div>

          <div className="mb-4">
  <label className="block text-gray-700 py-2">Password</label>
  <div className="relative">
    <input
      {...register("password")}
      type={toggle ? "password" : "text"}
      id="password"
      placeholder="Password"
      className={`w-full border rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
        errors.password ? "border-red-500" : "border-gray-300"
      }`}
      autoComplete="off"
      onChange={() => setLoginError(null)}
    />
    {/* Eye icon inside input */}
    <i
      className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-sky-600 ${
        toggle ? "fa-duotone fa-eye-slash" : "fa-duotone fa-eye"
      }`}
      onClick={handlepass}
    ></i>
  </div>
  {errors.password && (
    <p className="text-red-500 text-sm mt-1">
      {errors.password?.message}
    </p>
  )}
</div>


            <div className="mb-6 text-right">
              <Link
                to={ROUTES.forgetPassword}
                className="text-sky-600 hover:underline text-sm"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-md py-2 px-4 w-full transition"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
