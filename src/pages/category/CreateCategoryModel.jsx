import React, { useState } from "react";
import Modal from "../../common/modal/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { postRequest } from "../../config/apiFunctions";
import { CATEGORY } from "../../config/endPoints";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

const Schema = Yup.object().shape({
  icon: Yup.mixed()
    .test("file-required", "Icon Image is required", (value) => {
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
  name: Yup.string().required("Category Name is required"),
});

function CreateCategoryModel({
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
      form.append("name", data.name);
      form.append("icon", data.icon);

      // Include edited Arabic name if exists
      if (previewData?.arabic_name) {
        form.append("arabic_name", previewData.arabic_name);
      }

      const createResponse = await postRequest(
        `${CATEGORY.CREATE}?isCategoryCreated=true`,
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
      toast.error(error?.response?.data || "Something went wrong", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  // Handle preview (API)
  const handlePreview = async () => {
    setPreviewLoading(true);
    try {
      const form = new FormData();
      form.append("name", watch("name"));
      form.append("icon", watch("icon"));

      const previewResponse = await postRequest(CATEGORY.CREATE, form, {
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
      toast.error(error?.response?.data || "Preview failed", { autoClose: 2000 });
    } finally {
      setPreviewLoading(false);
    }
  };

  // Handle edit preview (go back to editing)
  const handleEditPreview = () => {
    setShowPreview(false);
    setPreviewData(null);
  };

  // Handle button click - first preview, then submit
  const handleMainButtonClick = () => {
    if (!showPreview) {
      // First click - show preview
      handlePreview();
    } else {
      // Second click - submit form
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
      title="Create Category"
      position="right"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6"
      >
        {/* ICON IMAGE */}
        <div className="w-full flex flex-col items-center justify-center">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icon image
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

            <input
              id="profileUpload"
              type="file"
              accept="image/*"
              {...register("icon")}
              onChange={(e) => {
                const file = e.target.files[0];
                setValue("icon", file);
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setPreviewImage(reader.result);
                  reader.readAsDataURL(file);
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
                  setValue("icon", null);
                }}
                className="absolute top-2 right-6 -mt-2 -mr-2 border border-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-xs bg-red-500 text-white"
              >
                <i className="fa-regular fa-xmark" />
              </button>
            )}
          </div>

          {errors.icon && (
            <p className="text-red-500 text-sm mt-2">
              {errors.icon.message}
            </p>
          )}
        </div>

        {/* CATEGORY NAME */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name(English)
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Enter category name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* PREVIEW SECTION (Editable) - Show when preview is available */}
        {previewData && showPreview && (
          <div className="border rounded-lg p-4 mt-4 bg-gray-50">
            <h3 className="text-lg font-semibold mb-3">Preview</h3>
            

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name (Arabic)
              </label>
              <input
                type="text"
                value={previewData.arabic_name || ""}
                onChange={(e) =>
                  setPreviewData({ ...previewData, arabic_name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-right"
                placeholder="Edit Arabic name if needed"
                dir="rtl"
              />
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
              Edit Preview
            </button>
          )}

          <button
            type="button"
            disabled={previewLoading || loading}
            onClick={handleMainButtonClick}
            className="primary-button disabled:opacity-50"
          >
            {previewLoading || loading ? (
              "Loading..."
            ) : showPreview ? (
              "Confirm & Create"
            ) : (
              "Preview & Create"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateCategoryModel;