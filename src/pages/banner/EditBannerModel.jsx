import React, { useEffect, useState } from "react";
import Modal from "../../common/modal/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { postRequest, putRequest } from "../../config/apiFunctions";
import { BANNER, FILEURL } from "../../config/endPoints";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

const Schema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  subTitle: Yup.string().required("Subtitle is required"),
  link: Yup.string().required("URL is required").url("Enter a valid URL"),
  image: Yup.mixed()
    .test("file-size", "File size must be less than 5MB", (value) => {
      if (!(value instanceof File)) return true;
      return value.size <= 5 * 1024 * 1024;
    })
    .test("file-type", "Only JPG, JPEG, and PNG formats are allowed", (value) => {
      if (!(value instanceof File)) return true;
      return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
    }),
});

function EditBannerModel({
  showEditModal,
  setShowEditModal,
  bannerData,
  userListCallBack,
}) {
  const formOptions = { resolver: yupResolver(Schema) };
  const { register, handleSubmit, reset, formState, watch, setValue, trigger } =
    useForm(formOptions);

  const { errors } = formState;
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const form = new FormData();
      form.append("bannerId", bannerData?.id);
      form.append("title", data.title);
      form.append("subTitle", data.subTitle);
      form.append("link", data.link);

      if (data.image instanceof File) {
        form.append("banner_image", data.image);
      }

      if (previewData?.title?.ar) form.append("arabic_title", previewData.title.ar);
      if (previewData?.subTitle?.ar)
        form.append("arabic_subtitle", previewData.subTitle.ar);

      const updateResponse = await putRequest(
        `${BANNER.UPDATE}/${bannerData?.id}?isBannerUpdated=true`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept-Language": "en",
          },
        }
      );

      if (updateResponse.data.statusCode === 200) {
        toast.success(updateResponse.data.message, { autoClose: 2000 });
        reset();
        setPreviewImage(null);
        setPreviewData(null);
        setShowPreview(false);
        setShowEditModal(false);
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

  const handlePreview = async () => {
    setPreviewLoading(true);
    try {
      const form = new FormData();
      form.append("bannerId", bannerData?.id);
      form.append("title", watch("title"));
      form.append("subTitle", watch("subTitle"));
      form.append("link", watch("link"));

      if (watch("image") instanceof File) {
        form.append("banner_image", watch("image"));
      }

      const previewResponse = await putRequest(
        `${BANNER.UPDATE}/${bannerData?.id}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept-Language": "en",
          },
        }
      );

      if (previewResponse.data.statusCode === 200) {
        setPreviewData(previewResponse.data.data);
        setShowPreview(true);
        toast.success("Preview generated successfully", { autoClose: 2000 });
      }
    } catch (error) {
      toast.error(error?.response?.data || "Preview failed", { autoClose: 2000 });
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleEditPreview = () => {
    setShowPreview(false);
    setPreviewData(null);
  };

  const handleMainButtonClick = async () => {
    if (!showPreview) {
      const valid = await trigger();
      if (!valid) return;
      handlePreview();
    } else {
      handleSubmit(onSubmit)();
    }
  };

  useEffect(() => {
    if (bannerData) {
      reset({
        title: bannerData?.title || "",
        subTitle: bannerData?.subTitle || "",
        link: bannerData?.link || "",
      });

      if (bannerData?.banner_image) {
        const fullImageUrl = bannerData.banner_image.startsWith("http")
          ? bannerData.banner_image
          : `${FILEURL}${bannerData.banner_image}`;
        setPreviewImage(fullImageUrl);
      }

      setPreviewData(null);
      setShowPreview(false);
    }
  }, [bannerData, reset]);

  const handleCloseModal = () => {
    setShowEditModal(false);
    reset();
    setPreviewImage(null);
    setPreviewData(null);
    setShowPreview(false);
  };

  return (
    <Modal
      isOpen={showEditModal}
      onClose={handleCloseModal}
      title="Edit Banner"
      position="right"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6">
        {/* IMAGE UPLOAD */}
        <div className="w-full flex flex-col items-center justify-center">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image
          </label>

          <div className="relative group w-25 h-25">
            <label htmlFor="profileUpload" className="cursor-pointer block w-full h-full">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Banner"
                  className="w-25 h-25 object-cover rounded-full border border-gray-300 shadow-sm"
                />
              ) : (
                <div className="w-25 h-25 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300 hover:bg-gray-200 transition">
                  <i className="fa-regular fa-camera fa-lg text-gray-500" />
                </div>
              )}
            </label>

            <input
              id="profileUpload"
              type="file"
              accept="image/*"
              {...register("image")}
              onChange={(e) => {
                const file = e.target.files[0];
                setValue("image", file);
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setPreviewImage(reader.result);
                  reader.readAsDataURL(file);
                } else if (bannerData?.banner_image) {
                  const fullImageUrl = bannerData.banner_image.startsWith("http")
                    ? bannerData.banner_image
                    : `${FILEURL}${bannerData?.banner_image}`;
                  setPreviewImage(fullImageUrl);
                }
              }}
              className="hidden"
            />

            {previewImage && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setPreviewImage(null);
                  setValue("image", null);
                }}
                className="absolute top-2 right-6 -mt-2 -mr-2 border border-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-xs bg-red-500 text-white"
              >
                <i className="fa-regular fa-xmark" />
              </button>
            )}
          </div>

          {errors.image && (
            <p className="text-red-500 text-sm mt-2">{errors.image.message}</p>
          )}
        </div>

        {/* TITLE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            maxLength={70}
            {...register("title")}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Enter title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
          <p
            className={`text-sm mt-1 ml-auto ${
              (watch("title")?.length || 0) > 70 ? "text-red-500" : "text-gray-500"
            }`}
          >
            {watch("title")?.length || 0}/70
          </p>
        </div>

        {/* SUBTITLE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subtitle
          </label>
          <input
            type="text"
            maxLength={100}
            {...register("subTitle")}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Enter subtitle"
          />
          {errors.subTitle && (
            <p className="text-red-500 text-sm mt-1">{errors.subTitle.message}</p>
          )}
          <p
            className={`text-sm mt-1 ml-auto ${
              (watch("subTitle")?.length || 0) > 100
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            {watch("subTitle")?.length || 0}/100
          </p>
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
          <input
            type="text"
            {...register("link")}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Enter URL"
          />
          {errors.link && (
            <p className="text-red-500 text-sm mt-1">{errors.link.message}</p>
          )}
        </div>

        {/* PREVIEW SECTION */}
        {previewData && showPreview && (
          <div className="border rounded-lg p-4 mt-4 bg-gray-50">
            <h3 className="text-lg font-semibold mb-3">Preview</h3>
            <div className="grid grid-cols-1 gap-4">
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
                      title: { ...previewData.title, ar: e.target.value },
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-right"
                  placeholder="Edit Arabic title"
                  dir="rtl"
                />
              </div>

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
                      subTitle: { ...previewData.subTitle, ar: e.target.value },
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-right"
                  placeholder="Edit Arabic subtitle"
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
              ? "Confirm & Update"
              : "Preview Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default EditBannerModel;
