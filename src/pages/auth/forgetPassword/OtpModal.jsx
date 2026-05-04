import React, { useEffect, useRef, useState } from "react";
import { postRequest } from "../../../config/apiFunctions";
import { AUTH } from "../../../config/endPoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import navigation hook


function OtpModal({ otp: initialOtp, setShowOtpModal, code, setCode, setShowResetPass }) {
  const navigate = useNavigate(); 
  const inputsRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otp, setOtp] = useState(initialOtp || ""); //   start with OTP from parent
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [resendCooldown, setResendCooldown] = useState(0);

  //  Keep OTP synced if parent sends new one
  useEffect(() => {
    if (initialOtp) setOtp(initialOtp);
  }, [initialOtp]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 3) inputsRef.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors = {};
    const fullCode = code.join("");
    if (fullCode.length !== 4) newErrors.otp = "Please enter complete 4-digit OTP";
    if (!passwords.newPassword) newErrors.newPassword = "New password is required";
    else if (passwords.newPassword.length < 6)
      newErrors.newPassword = "Password must be at least 6 characters";
    if (!passwords.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (passwords.newPassword !== passwords.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    const email = localStorage.getItem("admin_email");
    if (!email) {
      toast.error("Email not found. Please try again.");
      return;
    }

    try {
      setResendLoading(true);
      const response = await postRequest(AUTH.FORGOT_PASSWORD, { email });
      if (response?.data?.success) {
        const newOtp = response?.data?.data?.otp || "1234";
        setOtp(newOtp); //   update displayed OTP
        toast.success("New OTP sent successfully!");
        setResendCooldown(60);
        
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to resend code");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const email = localStorage.getItem("admin_email");
    const fullCode = code.join("");

    try {
      setLoading(true);
      const response = await postRequest(AUTH.RESET_PASSWORD, {
        email,
        otp: fullCode,
        password: passwords.newPassword,
      });

      if (response?.data?.success && response?.data?.statusCode === 200) {
        toast.success(response?.data?.message || "Password reset successful!");
        setShowOtpModal(false);
        setPasswords({ newPassword: "", confirmPassword: "" });
        setCode(["", "", "", ""]);
        navigate("/login"); 
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Enter Verification Code
        </h2>
        <p className="text-md text-gray-500 mb-6">
          We've sent a 4-digit verification code to your email. Please enter it below and set your new password.
        </p>

        {/*   Show OTP for both first-time and resend */}
        {otp && (
          <p className="text-sm text-gray-400 mb-4">
            <strong>OTP:</strong> {otp}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <div className="flex justify-between gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputsRef.current[index] = el)}
                  className={`w-12 h-12 text-center text-lg border rounded-lg focus:outline-none ${
                    errors.otp ? "border-red-500" : "border-gray-300"
                  }`}
                />
              ))}
            </div>
            {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp}</p>}
          </div>

          {/* New Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.newPassword ? "text" : "password"}
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none pr-10 ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("newPassword")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPasswords.newPassword ? (
                  // 👁️‍🗨️ Eye Open SVG
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  // 🙈 Eye Off SVG
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none pr-10 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirmPassword ? (
                  // 👁️‍🗨️ Eye Open SVG
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  // 🙈 Eye Off SVG
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md py-2 px-4 w-full transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify & Reset Password"}
          </button>

          {/* Resend OTP Section */}
          <div className="text-center mt-4">
            <p className="text-md text-gray-500">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || resendLoading}
                className={`font-semibold ${
                  resendCooldown > 0 || resendLoading
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:underline"
                }`}
              >
                {resendLoading
                  ? "Sending..."
                  : resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend Code"}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OtpModal;
