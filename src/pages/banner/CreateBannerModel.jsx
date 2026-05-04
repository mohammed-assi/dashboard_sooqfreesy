import React, { useState } from "react";
import Modal from "../../common/modal/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { postRequest } from "../../config/apiFunctions";
import { BANNER } from "../../config/endPoints";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

const Schema = Yup.object().shape({
  icon: Yup.mixed()
    .test("file-required", "Image is required", (value) => {
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
  title: Yup.string().required("Title is required"),
  subtitle: Yup.string().required("Subtitle is required"),
  url: Yup.string()
    .url("Please enter a valid URL") // validates URL format
    .required("URL is required"), // ensures field is not empty
});

function CreateBannerModel({
  showCreateModal,
  setShowCreateModal,
  userListCallBack,
}) {
  const formOptions = { resolver: yupResolver(Schema) };
  const { register, handleSubmit, reset, formState, watch, setValue } =
    useForm(formOptions);
  const { errors } = formState;

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Handle submission (save)
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const form = new FormData();
      form.append("title", data.title);
      form.append("subTitle", data.subtitle);
      form.append("link", data.url);
      form.append("banner_image", data.icon);

      if (previewData?.arabic_title) {
        form.append("arabic_title", previewData.arabic_title);
      }
      if (previewData?.arabic_subtitle) {
        form.append("arabic_subtitle", previewData.arabic_subtitle);
      }

      const createResponse = await postRequest(
        `${BANNER.CREATE}?isBannerCreated=true`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept-Language": "en",
          },
        }
      );

      if (createResponse.data.statusCode === 200) {
        toast.success(createResponse.data.message, { autoClose: 2000 });
        reset();
        setPreviewImage(null);
        setPreviewData(null);
        setShowPreview(false);
        setShowCreateModal(false);
        userListCallBack();
      }
    } catch (error) {
      toast.error(error?.response?.data || "Something went wrong", {
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle preview (API)
  const handlePreview = async (data) => {
    setPreviewLoading(true);
    try {
      const form = new FormData();
      form.append("title", data.title);
      form.append("subTitle", data.subtitle);
      form.append("link", data.url);
      form.append("banner_image", data.icon);

      const previewResponse = await postRequest(`${BANNER.CREATE}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept-Language": "en",
        },
      });

      if (previewResponse.data.statusCode === 200) {
        setPreviewData(previewResponse.data.data);
        setShowPreview(true);
        toast.success("Preview generated successfully", { autoClose: 2000 });
      }
    } catch (error) {
      toast.error(error?.response?.data || "Preview failed", {
        autoClose: 2000,
      });
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleEditPreview = () => {
    setShowPreview(false);
    setPreviewData(null);
  };

  //   FIX: Wrap preview inside handleSubmit so validation runs first
  const handleMainButtonClick = () => {
    if (!showPreview) {
      handleSubmit(handlePreview)();
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    reset();
    setPreviewImage(null);
    setPreviewData(null);
    setShowPreview(false);
  };

  return (
    <Modal
      isOpen={showCreateModal}
      onClose={handleCloseModal}
      title="Add Banner"
      position="right"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6"
      >
        {/* IMAGE UPLOAD */}
        <div className="w-full flex flex-col items-center justify-center">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image
          </label>

          <div className="relative group w-25 h-25">
            <label
              htmlFor="profileUpload"
              className="cursor-pointer block w-full h-full"
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-25 h-25 object-cover rounded-full border border-gray-300 shadow-sm"
                />
              ) : (
                <div className="w-25 h-25 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300 hover:bg-gray-200 transition">
                  <i className="fa-regular fa-camera fa-lg text-gray-500" />
                </div>
              )}
            </label>

            {/*   FIX: Use register with onChange and shouldValidate */}
            <input
              id="profileUpload"
              type="file"
              accept="image/*"
              {...register("icon", {
                onChange: (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setValue("icon", file, { shouldValidate: true });
                    const reader = new FileReader();
                    reader.onloadend = () => setPreviewImage(reader.result);
                    reader.readAsDataURL(file);
                  } else {
                    setValue("icon", null, { shouldValidate: true });
                    setPreviewImage(null);
                  }
                },
              })}
              className="hidden"
            />

            {previewImage && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setPreviewImage(null);
                  setValue("icon", null, { shouldValidate: true });
                }}
                className="absolute top-2 right-6 -mt-2 -mr-2 border border-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-xs bg-red-500 text-white"
              >
                <i className="fa-regular fa-xmark" />
              </button>
            )}
          </div>

          {errors.icon && (
            <p className="text-red-500 text-sm mt-2">{errors.icon.message}</p>
          )}
        </div>

        {/* TITLE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            maxLength={70}
            {...register("title")}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Enter title"
          />
          <div className="flex justify-between">
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
            <p
              className={`text-sm mt-1 ml-auto ${
                (watch("title")?.length || 0) > 70
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {watch("title")?.length || 0}/70
            </p>
          </div>
        </div>

        {/* SUBTITLE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subtitle
          </label>
          <input
            type="text"
            maxLength={100}
            {...register("subtitle")}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Enter subtitle"
          />
          <div className="flex justify-between">
            {errors.subtitle && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subtitle.message}
              </p>
            )}
            <p
              className={`text-sm mt-1 ml-auto ${
                (watch("subtitle")?.length || 0) > 90
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {watch("subtitle")?.length || 0}/100
            </p>
          </div>
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL
          </label>
          <input
            type="text"
            {...register("url")}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Enter URL"
          />
          {errors.url && (
            <p className="text-red-500 text-sm mt-1">{errors.url.message}</p>
          )}
        </div>

        {/* PREVIEW SECTION */}
        {previewData && showPreview && (
          <div className="border rounded-lg p-4 mt-4 bg-gray-50">
            <h3 className="text-lg font-semibold mb-3">Preview</h3>

            <div className="grid grid-cols-1 gap-4">
              {/* Arabic Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Arabic Title
                </label>
                <input
                  type="text"
                  value={previewData.title?.ar || ""}
                  onChange={(e) =>
                    setPreviewData({
                      ...previewData,
                      title: {
                        ...previewData.title,
                        ar: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-right"
                  placeholder="Edit Arabic title if needed"
                  dir="rtl"
                />
              </div>

              {/* Arabic Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Arabic Subtitle
                </label>
                <input
                  type="text"
                  value={previewData.subTitle?.ar || ""}
                  onChange={(e) =>
                    setPreviewData({
                      ...previewData,
                      subTitle: {
                        ...previewData.subTitle,
                        ar: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-right"
                  placeholder="Edit Arabic subtitle if needed"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
        )}

        {/* BUTTONS */}
        <div className="text-right mt-4 flex justify-end gap-3">
          {showPreview && (
            <button
              type="button"
              onClick={handleEditPreview}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
            >
              Edit
            </button>
          )}

          <button
            type="button"
            disabled={previewLoading || loading}
            onClick={handleMainButtonClick}
            className="primary-button disabled:opacity-50"
          >
            {previewLoading || loading
              ? "Loading..."
              : showPreview
              ? "Confirm & Create"
              : "Preview & Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateBannerModel;
