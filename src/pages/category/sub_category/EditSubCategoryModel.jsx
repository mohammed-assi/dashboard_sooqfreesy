import React, { useEffect, useState } from "react";
import Modal from "../../../common/modal/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { postRequest } from "../../../config/apiFunctions";
import { FILEURL, SUBCATEGORY } from "../../../config/endPoints";
import { toast } from "react-toastify";
import Tabs from "../../../common/tabs/Tabs";

// ✅ Validation Schema
const Schema = Yup.object().shape({
  image: Yup.mixed()
    .required("Image is required")
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
  name: Yup.string().required("Name is required"),
  parent_category: Yup.string().required("Parent Category is required"),
});

function EditSubCategoryModel({
  tabsData,
  mainCategoryList,
  catDetail,
  activeTab,
  handleChangeUserTab,
  showEditModal,
  setShowEditModal,
  subCategoryListCallBack,
}) {
  const imagePath = import.meta.env.VITE_APP_MEDIA_FILE_URL;
  const formOptions = { resolver: yupResolver(Schema) };
  const { register, handleSubmit, reset, formState, watch, setValue } =
    useForm(formOptions);
  const { errors } = formState;

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // ✅ Handle submission (save)
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      7;
      let formData = new FormData();
      formData.append("name", data.name);
      formData.append("categoryId", data.parent_category);
      formData.append("subCategoryId", catDetail.id);

      if (previewData?.arabic_name) {
        formData.append("arabic_name", previewData.arabic_name);
      }

      if (data.image instanceof File) {
        formData.append("icon", data.image);
      }

      const res = await postRequest(
        `${SUBCATEGORY.UPDATE}?isSubCategoryUpdated=true`,
        formData
      );

      if (res?.data?.statusCode === 200) {
        toast.dismiss();
        toast.success(res.data.message || "Sub-category updated successfully", {
          autoClose: 2000,
        });
        reset();
        setPreviewImage(null);
        setPreviewData(null);
        setShowPreview(false);
        setShowEditModal(false);
        subCategoryListCallBack();
      } else {
        toast.dismiss();
        toast.error(res?.data?.message || "Something went wrong", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error?.response?.data?.message || "Something went wrong", {
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle preview
  const handlePreview = async (data) => {
    setPreviewLoading(true);
    let formData = new FormData();
    formData.append("categoryId", data.parent_category);
    formData.append("name", data.name);
    formData.append("subCategoryId", catDetail.id);

    if (data.image instanceof File) {
      formData.append("icon", data.image);
    }

    try {
      const res = await postRequest(SUBCATEGORY.UPDATE, formData);
      if (res.data.statusCode === 200) {
        setPreviewData(res.data.data);
        setShowPreview(true);
        toast.success("Preview generated successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Preview failed", {
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

  const handleMainButtonClick = () => {
    if (!showPreview) {
      handleSubmit(handlePreview)(); // ✅ Validates before preview
    } else {
      handleSubmit(onSubmit)(); // ✅ Validates before final submit
    }
  };

  useEffect(() => {
    if (catDetail) {
      setValue("name", catDetail?.name || "");
      if (catDetail?.category_id) {
        setValue("parent_category", catDetail.category_id.toString());
      } else {
        setValue("parent_category", "");
      }

      if (catDetail?.image_url) {
        const fullImageUrl = catDetail.image_url.startsWith("http")
          ? catDetail.image_url
          : `${FILEURL}${catDetail.image_url}`;
        setPreviewImage(fullImageUrl);
        setValue("image", catDetail.image_url);
      } else {
        setPreviewImage(null);
        setValue("image", "");
      }

      setPreviewData(null);
      setShowPreview(false);
    }
  }, [catDetail, setValue, imagePath]);

  const handleCloseModal = () => {
    setShowEditModal(false);
    window.location.reload();
  };

  return (
    <Modal
      isOpen={showEditModal}
      onClose={handleCloseModal}
      title="Edit Sub Category"
      position="right"
    >
      <Tabs
        tabsData={tabsData}
        activeTab={activeTab}
        handleChangeUserTab={handleChangeUserTab}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6"
      >
        {/* ✅ IMAGE */}
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
                } else if (catDetail?.image_url) {
                  const fullImageUrl = catDetail.image_url.startsWith("http")
                    ? catDetail.image_url
                    : `${imagePath}/${catDetail.image_url}`;
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

        {/* ✅ NAME & PARENT CATEGORY */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="Name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline focus:outline-(--green-color)"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
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

        {/* ✅ PREVIEW SECTION */}
        {previewData && showPreview && (
          <div className="border rounded-lg p-4 mt-4 bg-gray-50">
            <h3 className="text-lg font-semibold mb-3">Preview</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Edit Arabic Name
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-right"
                placeholder="Edit Arabic name if needed"
              />
            </div>
          </div>
        )}

        {/* ✅ BUTTONS */}
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

export default EditSubCategoryModel;
