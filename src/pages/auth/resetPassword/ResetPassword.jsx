import React, { useState } from "react";
import { ROUTES, TITLES } from "../../../app/constants";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router";
import { AUTH } from "../../../config/endPoints";
import { putRequest } from "../../../config/apiFunctions";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special"
    ),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords do not matched"),
});

function ResetPassword({ code }) {
  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;
  const navigate = useNavigate();

  const [toggleNew, setToggleNew] = useState(true);
  const [toggleConfirm, setToggleConfirm] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    setLoading(true);
    const fullCode = code.join("");

    if (fullCode.length === 4) {
      const payload = {
        password: e.password,
        otp: fullCode,
      };
      try {
        const response = await putRequest(AUTH.RESET_PASSWORD, payload);
        const { status } = response;
        const { success } = response.data;

        if (success && status === 200) {
          setLoading(false);
          toast.success(response?.data?.message, {
            position: "top-right",
            autoClose: 2000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            closeButton: true,
          });
          reset();
          navigate(ROUTES.login);
        } else {
          setLoading(false);
        }
      } catch (error) {
        const { message } = error.response.data;
        toast.error(message, {
          position: "top-right",
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          closeButton: true,
        });
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
        <h1 className="text-2xl font-semibold mb-4">Reset password</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-600 py-2">Password</label>
            <div className="input-icon-grp">
              <input
                {...register("password")}
                type={toggleNew === true ? "password" : "text"}
                id="password"
                className={`w-full border  rounded-md py-2 px-3 focus:outline-none focus:border-(--green-color) ${
                  errors.password ? "border-red-500" : "border-gray-400"
                }`}
                autoComplete="off"
              />
              <i
                className={
                  toggleNew === true
                    ? "fa-duotone fa-solid fa-eye-slash show-pass"
                    : "fa-duotone fa-solid fa-eye show-pass"
                }
                onClick={() => setToggleNew(!toggleNew)}
              ></i>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password?.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 py-2">Confirm password</label>
            <div className="input-icon-grp">
              <input
                {...register("confirmPassword")}
                type={toggleConfirm === true ? "password" : "text"}
                id="confirmPassword"
                className={`w-full border  rounded-md py-2 px-3 focus:outline-none focus:border-(--green-color) ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-400"
                }`}
                autoComplete="off"
              />
              <i
                className={
                  toggleConfirm === true
                    ? "fa-duotone fa-solid fa-eye-slash show-pass"
                    : "fa-duotone fa-solid fa-eye show-pass"
                }
                onClick={() => setToggleConfirm(!toggleConfirm)}
              ></i>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword?.message}
              </p>
            )}
          </div>

          <div className="mb-6 text-blue-500 text-end">
            <Link to={ROUTES.login} className="hover:underline">
              Back to login
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="border-2 border-none bg-(--green-color) hover:bg-main-700 text-white font-semibold rounded-md py-2 px-4 w-full transition"
          >
            {loading ? "Loading..." : "Reset Password"}
          </button>
        </form>
      </div>
    </>
  );
}

export default ResetPassword;
