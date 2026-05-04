import React, { useEffect, useState } from "react";
import { TITLES, LOCAL_STORAGE, ROUTES } from "../../app/constants";
import PageMeta from "../../common/PageMeta";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import UpdatePassModal from "./section/UpdatePassModal";
import { useSelector } from "react-redux";
import { USERS, AUTH, FILEURL } from "../../config/endPoints";
import { getRequest, postRequest } from "../../config/apiFunctions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Setting() {
  const [previewImage, setPreviewImage] = useState(null);
  const [showUpdatePassModal, setShowUpdatePassModal] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // ✅ Validation Schema
  const validationSchema = Yup.object().shape({
    image: Yup.mixed()
      .test("file-required", "Image is required", function (value) {
        const { previewImage } = this.options.context;
        if (previewImage) return true;
        return value instanceof File;
      })
      .test("file-size", "File size must be less than 5MB", (value) => {
        if (!(value instanceof File)) return true;
        return value.size <= 5 * 1024 * 1024;
      })
      .test(
        "file-type",
        "Only JPG, JPEG, and PNG formats are allowed",
        (value) => {
          if (!(value instanceof File)) return true;
          return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
        }
      ),
    name: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    context: { previewImage },
  });

  // ✅ Fetch admin profile
  const getAdminProfile = async () => {
    try {
      setLoadingProfile(true);
      const res = await getRequest(AUTH.ADMIN_PROFILE);

      if (res?.status === 200) {
        const profileData = res?.data?.data;
        setValue("name", profileData.username || "");
        setValue("email", profileData.email || "");
        setValue("image", profileData.user_profile_url || "");

        const fullImagePath = profileData.user_profile_url
          ? `${FILEURL}${profileData.user_profile_url}`
          : null;
        setPreviewImage(fullImagePath);

        const storedUser = JSON.parse(
          localStorage.getItem(LOCAL_STORAGE.USER) || "{}"
        );
        const updatedUser = { ...storedUser, ...profileData };
        localStorage.setItem(LOCAL_STORAGE.USER, JSON.stringify(updatedUser));
      } else {
        toast.error("Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      toast.error("Something went wrong while fetching profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    getAdminProfile();
  }, []);

  // ✅ Submit Handler
  const onSubmit = async (formData) => {
    try {
      const payload = new FormData();
      payload.append("username", formData.name);

      if (formData.image instanceof File) {
        payload.append("user_profile_url", formData.image);
      }

      const response = await postRequest(USERS.UPDATE_PROFILE, payload);
      const { success, statusCode, data } = response?.data || {};

      if (success && statusCode === 200) {
        const storedUser =
          JSON.parse(localStorage.getItem(LOCAL_STORAGE.USER)) || {};
        const updatedUser = {
          ...storedUser,
          username: formData.name,
          profile_picture: data?.profile_picture,
        };
        localStorage.setItem(LOCAL_STORAGE.USER, JSON.stringify(updatedUser));

        if (data?.profile_picture) {
          setPreviewImage(`${FILEURL}${data.profile_picture}`);
        }

        toast.success("Profile updated successfully");
        window.location.href = ROUTES.setting;
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <PageMeta title={TITLES?.setting} description="Dashboard" />
      <h1 className="font-semibold text-xl">{TITLES?.setting}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="my-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 rounded-lg shadow-sm">
          {/* Profile Picture */}
          <div className="w-full md:col-span-1 flex flex-col items-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image
            </label>

            <div className="relative group w-30 h-30">
              <label
                htmlFor="profileUpload"
                className="cursor-pointer block w-full h-full"
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-30 h-30 object-cover rounded-full border border-gray-300 shadow-sm"
                  />
                ) : (
                  <div className="w-30 h-30 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300 hover:bg-gray-200 transition">
                    <i className="fa-regular fa-camera fa-lg text-gray-500" />
                  </div>
                )}
              </label>

              <input
                id="profileUpload"
                type="file"
                accept="image/*"
                {...register("image", {
                  onChange: (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setValue("image", file, { shouldValidate: true });
                      const reader = new FileReader();
                      reader.onloadend = () => setPreviewImage(reader.result);
                      reader.readAsDataURL(file);
                    } else {
                      setValue("image", null, { shouldValidate: true });
                      setPreviewImage(null);
                    }
                  },
                })}
                className="hidden"
              />

              {previewImage && (
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImage(null);
                    setValue("image", null, { shouldValidate: true });
                  }}
                  className="absolute top-3 right-6 -mt-2 -mr-2 border border-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-xs bg-red-500 text-white"
                >
                  <i className="fa-regular fa-xmark" />
                </button>
              )}
            </div>

            {errors.image && (
              <p className="text-red-500 text-sm mt-2">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Name & Email */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline focus:outline-(--green-color)"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                disabled
                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-200"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowUpdatePassModal(true)}
              >
                Update Password
              </button>
              <button type="submit" className="primary-button">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </form>

      <UpdatePassModal
        showUpdatePassModal={showUpdatePassModal}
        setShowUpdatePassModal={setShowUpdatePassModal}
      />
    </>
  );
}

export default Setting;
