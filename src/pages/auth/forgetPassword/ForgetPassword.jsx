// import React, { useState } from "react";
// import PageMeta from "../../../common/PageMeta";
// import { ROUTES, TITLES } from "../../../app/constants";
// import { Link } from "react-router";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as Yup from "yup";
// import { AUTH } from "../../../config/endPoints";
// import { toast } from "react-toastify";
// import { postRequest } from "../../../config/apiFunctions";
// import OtpModal from "./OtpModal";
// import ResetPassword from "../resetPassword/ResetPassword";
// import logo from "../../../assets/images/headerLogo.svg";
// const Schema = Yup.object().shape({
//   email: Yup.string().required("Email is required"),
// });

// const ForgetPassword = () => {
//   const formOptions = { resolver: yupResolver(Schema) };
//   const { register, handleSubmit, formState, reset } = useForm(formOptions);
//   const { errors } = formState;
//   const [loading, setLoading] = useState(false);
//   const [code, setCode] = useState(["", "", "", ""]);
//   const [showResetPass, setShowResetPass] = useState(false);
//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [otp, setOtp] = useState([]);

//   const onSubmit = async (e) => {
//     setLoading(true);
//     localStorage.setItem("admin_email", e.email);

//     const payload = {
//       email: e.email,
//     };

//     console.log(payload);
//     try {
//       const response = await postRequest(AUTH.FORGOT_PASSWORD, payload);

//       const resData = response?.data;

//       console.log(resData , "resData");

//       // Handle success case
//       if (resData?.success && resData?.statusCode === 200) {
//         setOtp(resData?.data?.otp);
//         console.log(otp , "otp");
//         toast.success(resData?.message || "OTP sent successfully!", {
//           position: "top-right",
//           autoClose: 2000,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           closeButton: true,
//         });
//         setShowOtpModal(true);
//         reset();
//       }
//       // Handle backend error with success: false
//       else {
//         toast.error(resData?.message || "Something went wrong!", {
//           position: "top-right",
//           autoClose: 2000,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           closeButton: true,
//         });
//       }
//     } catch (error) {
//       // Handle network or unexpected errors
//       toast.error(
//         error?.response?.data?.message ||
//           error?.response?.data?.error ||
//           "An unexpected error occurred!",
//         {
//           position: "top-right",
//           autoClose: 2000,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           closeButton: true,
//         }
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <PageMeta title={TITLES?.forgetPassword} description="Login" />
//       <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-white to-blue-50">
//         <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-100">
//           {/* Logo */}
//           <div className="flex justify-center mb-6">
//             <img
//               src={logo}
//               alt="SouqSyria Logo"
//               className="h-12 object-contain"
//             />
//           </div>

//           {showResetPass ? (
//             <ResetPassword code={code} />
//           ) : (
//             <>
//               <h1 className="text-xl font-semibold mb-6 text-center text-gray-900">
//                 Forgot Password
//               </h1>

//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                 <div>
//                   <label className="block text-gray-600 text-sm mb-2">
//                     Email
//                   </label>
//                   <input
//                     {...register("email")}
//                     type="email"
//                     id="email"
//                     placeholder="email"
//                     className={`w-full border rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1778BE] ${
//                       errors.email ? "border-red-500" : "border-gray-300"
//                     }`}
//                     autoComplete="off"
//                   />
//                   {errors.email && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.email?.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="text-right">
//                   <Link
//                     to={ROUTES.login}
//                     className="text-[#1778BE] hover:underline text-sm"
//                   >
//                     Back to login
//                   </Link>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="bg-[#1778BE] hover:bg-blue-700 text-white font-medium rounded-md py-2 px-4 w-full transition"
//                 >
//                   {loading ? "Loading..." : "Submit"}
//                 </button>
//               </form>
//             </>
//           )}
//         </div>
//       </div>

//       {showOtpModal && (
//         <OtpModal
//           otp={otp}
//           setShowOtpModal={setShowOtpModal}
//           code={code}
//           setCode={setCode}
//           setShowResetPass={setShowResetPass}
//         />
//       )}
//     </>
//   );
// };

// export default ForgetPassword;

import React, { useState } from "react";
import PageMeta from "../../../common/PageMeta";
import { ROUTES, TITLES } from "../../../app/constants";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { AUTH } from "../../../config/endPoints";
import { toast } from "react-toastify";
import { postRequest } from "../../../config/apiFunctions";
import OtpModal from "./OtpModal";
import ResetPassword from "../resetPassword/ResetPassword";
import logo from "../../../assets/images/headerLogo.svg";

const Schema = Yup.object().shape({
  email: Yup.string().required("Email is required"),
});

const ForgetPassword = () => {
  const formOptions = { resolver: yupResolver(Schema) };
  const { register, handleSubmit, formState, reset } = useForm(formOptions);
  const { errors } = formState;
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(["", "", "", ""]);
  const [showResetPass, setShowResetPass] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(""); // ✅ OTP state in parent

  const onSubmit = async (e) => {
    setLoading(true);
    localStorage.setItem("admin_email", e.email);

    const payload = { email: e.email };

    try {
      const response = await postRequest(AUTH.FORGOT_PASSWORD, payload);
      const resData = response?.data;

      if (resData?.success && resData?.statusCode === 200) {
        setOtp(resData?.data?.otp); // ✅ store OTP from backend
        toast.success(resData?.message || "OTP sent successfully!");
        setShowOtpModal(true);
        reset();
      } else {
        toast.error(resData?.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "An unexpected error occurred!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title={TITLES?.forgetPassword} description="Login" />
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-white to-blue-50">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-100">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="SouqSyria Logo" className="h-12 object-contain" />
          </div>

          {showResetPass ? (
            <ResetPassword code={code} />
          ) : (
            <>
              <h1 className="text-xl font-semibold mb-6 text-center text-gray-900">
                Forgot Password
              </h1>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-gray-600 text-sm mb-2">Email</label>
                  <input
                    {...register("email")}
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    className={`w-full border rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1778BE] ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    autoComplete="off"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
                  )}
                </div>

                <div className="text-right">
                  <Link
                    to={ROUTES.login}
                    className="text-[#1778BE] hover:underline text-sm"
                  >
                    Back to login
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#1778BE] hover:bg-blue-700 text-white font-medium rounded-md py-2 px-4 w-full transition"
                >
                  {loading ? "Loading..." : "Submit"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {showOtpModal && (
        <OtpModal
          otp={otp}             //  pass OTP
          setOtp={setOtp}       //  allow modal to update OTP
          setShowOtpModal={setShowOtpModal}
          code={code}
          setCode={setCode}
          setShowResetPass={setShowResetPass}
        />
      )}
    </>
  );
};

export default ForgetPassword;

