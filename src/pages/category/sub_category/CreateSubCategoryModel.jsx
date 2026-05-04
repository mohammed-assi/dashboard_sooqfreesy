import React, { useState } from "react";
import Modal from "../../../common/modal/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { postRequest } from "../../../config/apiFunctions";
import { SUBCATEGORY } from "../../../config/endPoints";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

const Schema = Yup.object().shape({
  image: Yup.mixed()
    .required("Image is required")
    .test("file-size", "File size must be less than 5MB", (value) => {
      if (!value) return true;
      return value.size <= 5 * 1024 * 1024;
    })
    .test(
      "file-type",
      "Only JPG, JPEG, and PNG formats are allowed",
      (value) => {
        if (!value) return true;
        return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
      }
    ),
  name: Yup.string().required("Category Name is required"),
  parent_category: Yup.string().required("Parent category is required"),
});

function CreateSubCategoryModel({
  showCreateModal,
  setShowCreateModal,
  subCategoryListCallBack,
  mainCategoryList,
}) {
  const formOptions = { resolver: yupResolver(Schema) };
  const { register, handleSubmit, reset, formState, setValue } =
    useForm(formOptions);
  const { errors } = formState;

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // ---- Create Subcategory ----
  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("categoryId", data.parent_category);
    formData.append("name", data.name);
    formData.append("icon", data.image);

    if (previewData?.arabic_name) {
      formData.append("arabic_name", previewData.arabic_name);
    }

    try {
      const res = await postRequest(
        `${SUBCATEGORY.CREATE}?isSubCategoryCreated=true`,
        formData
      );
      if (res.data.statusCode === 200) {
        toast.success(res.data.message);
        reset();
        setPreviewImage(null);
        setPreviewData(null);
        setShowPreview(false);
        setShowCreateModal(false);
        subCategoryListCallBack();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ---- Preview ----
  const handlePreview = async (data) => {
    setPreviewLoading(true);
    const formData = new FormData();
    formData.append("categoryId", data.parent_category);
    formData.append("name", data.name);
    formData.append("icon", data.image);

    try {
      const res = await postRequest(SUBCATEGORY.CREATE, formData);
      if (res.data.statusCode === 200) {
        setPreviewData(res.data.data);
        setShowPreview(true);
        toast.success("Preview generated successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Preview failed");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleEditPreview = () => {
    setShowPreview(false);
    setPreviewData(null);
  };

  const handleMainButtonClick = () => {
    if (!showPreview) {
      handleSubmit(handlePreview)();
    } else {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <Modal
      isOpen={showCreateModal}
      onClose={() => {
        setShowCreateModal(false);
        reset();
        setPreviewImage(null);
        setPreviewData(null);
        setShowPreview(false);
      }}
      title="Create Sub Category"
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
                  alt="Preview"
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
                className="absolute top-2 right-6 border border-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-xs bg-red-500 text-white"
              >
                <i className="fa-regular fa-xmark" />
              </button>
            )}
          </div>
          {errors.image && (
            <p className="text-red-500 text-sm mt-2">{errors.image.message}</p>
          )}
        </div>

        {/* NAME & PARENT CATEGORY */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Category
            </label>
            <select
              {...register("parent_category")}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select</option>
              {mainCategoryList?.categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.parent_category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.parent_category.message}
              </p>
            )}
          </div>
        </div>

        {/* PREVIEW SECTION */}
        {previewData && showPreview && (
          <div className="border rounded-lg p-4 mt-4 bg-gray-50">
            <h3 className="text-lg font-semibold mb-3">Preview</h3>

            <div className="flex gap-4 items-center mb-4">
              {previewData.icon && (
                <img
                  src={previewData.icon}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-full border border-gray-300"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Arabic Name
              </label>
              <input
                type="text"
                value={previewData.arabic_name || ""}
                onChange={(e) =>
                  setPreviewData({
                    ...previewData,
                    arabic_name: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Edit Arabic name if needed"
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
              ? "Confirm & Save"
              : "Preview & Submit"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateSubCategoryModel;
