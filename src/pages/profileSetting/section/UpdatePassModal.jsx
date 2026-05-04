import React, { useState } from "react";
import Modal from "../../../common/modal/Modal";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { postRequest, putRequest } from "../../../config/apiFunctions";
import { AUTH } from "../../../config/endPoints";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special"
    ),
  oldpassword: Yup.string().required("Old password is required"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords do not matched"),
});

function UpdatePassModal({ showUpdatePassModal, setShowUpdatePassModal }) {
  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  const [toggleOld, setToggleOld] = useState(true);
  const [toggleNew, setToggleNew] = useState(true);
  const [toggleConfirm, setToggleConfirm] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    setLoading(true);
    try {
      const response = await postRequest(AUTH.UPDATE_PASSWORD, {
        currentPassword: e.oldpassword,
        newPassword: e.password,
      });

      const { status } = response;

      console.log(response);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        reset();
        setLoading(false);
        setShowUpdatePassModal(false);
        toast.success(response?.data?.message, {
          position: "top-right",
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          closeButton: true,
        });
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
      setShowUpdatePassModal(false);
    }
  };

  return (
    <Modal
      isOpen={showUpdatePassModal}
      onClose={() => setShowUpdatePassModal(false)}
      title="Update password"
      position="right"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-600 py-2">Old password</label>
          <div className="input-icon-grp">
            <input
              {...register("oldpassword")}
              type={toggleOld === true ? "password" : "text"}
              id="oldpassword"
              className={`w-full border  rounded-md py-2 px-3 pe-12 focus:outline-none focus:border-(--green-color) ${
                errors.oldpassword ? "border-red-500" : "border-gray-400"
              }`}
              autoComplete="off"
            />
            <i
              className={
                toggleOld === true
                  ? "fa-duotone fa-solid fa-eye-slash show-pass"
                  : "fa-duotone fa-solid fa-eye show-pass"
              }
              onClick={() => setToggleOld(!toggleOld)}
            ></i>
          </div>
          {errors.oldpassword && (
            <p className="text-red-500 text-sm">
              {errors.oldpassword?.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 py-2">Password</label>
          <div className="input-icon-grp">
            <input
              {...register("password")}
              type={toggleNew === true ? "password" : "text"}
              id="password"
              className={`w-full border  rounded-md py-2 px-3 pe-12 focus:outline-none focus:border-(--green-color) ${
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
              className={`w-full border  rounded-md py-2 px-3 pe-12 focus:outline-none focus:border-(--green-color) ${
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

        <div className="pt-5 text-center">
          <button disabled={loading} type="submit" className="primary-button">
            {loading ? "Loading..." : "Update password"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default UpdatePassModal;
