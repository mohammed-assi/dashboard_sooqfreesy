import React, { useEffect, useState } from "react";
import Modal from "../../common/modal/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { postRequest } from "../../config/apiFunctions";
import { CATEGORY, FILEURL } from "../../config/endPoints";
import { toast } from "react-toastify";
import Tabs from "../../common/tabs/Tabs";

// ✅ Validation Schema (updated icon_img → image)
const Schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  arabic_name: Yup.string(),
  image: Yup.mixed()
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
});

function EditCategoryModel({
  tabsData,
  activeTab,
  handleChangeUserTab,
  showEditModal,
  setShowEditModal,
  mainCatData,
  userListCallBack,
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

  // ✅ Final Submit
  const handleUpdate = async (data) => {
    setLoading(true);
    try {
      const form = new FormData();
      form.append("categoryId", mainCatData?.id);
      form.append("name", data.name);
      form.append("arabic_name", previewData?.arabic_name || "");

      if (data.image instanceof File) {
        form.append("icon", data.image);
      }

      const updateResponse = await postRequest(
        `${CATEGORY.UPDATE}?isCategoryUpdated=true`,
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
      toast.error(error?.response?.data || "Update failed", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Preview Handler
  const handlePreview = async (data) => {
    setPreviewLoading(true);
    try {
      const form = new FormData();
      form.append("categoryId", mainCatData?.id);
      form.append("name", data.name);

      if (data.image instanceof File) {
        form.append("icon", data.image);
      }

      const previewResponse = await postRequest(`${CATEGORY.UPDATE}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept-Language": "en",
        },
      });

      if (previewResponse.data.statusCode === 200) {
        const previewData = previewResponse.data.data;
        setPreviewData(previewData);
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

  const handleMainButtonClick = handleSubmit((data) => {
    if (!showPreview) {
      handlePreview(data);
    } else {
      handleUpdate(data);
    }
  });

  useEffect(() => {
    if (mainCatData) {
      reset({
        name: mainCatData?.name || "",
      });
      setPreviewImage(
        mainCatData?.image_url ? `${FILEURL}${mainCatData.image_url}` : null
      );
      setPreviewData(null);
      setShowPreview(false);
    }
  }, [mainCatData, reset]);

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
      title="Edit Category"
      position="right"
    >
      <Tabs
        tabsData={tabsData}
        activeTab={activeTab}
        handleChangeUserTab={handleChangeUserTab}
      />

      <form className="grid grid-cols-1 gap-6">
        {/* Image Upload */}
        <div className="w-full flex flex-col items-center justify-center">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image
          </label>
          <div className="relative group w-24 h-24">
            <label
              htmlFor="profileUpload"
              className="cursor-pointer block w-full h-full"
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-24 h-24 object-cover rounded-full border border-gray-300 shadow-sm"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300 hover:bg-gray-200 transition">
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
                } else if (mainCatData?.image_url) {
                  setPreviewImage(`${FILEURL}${mainCatData.image_url}`);
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
                className="absolute top-1 right-1 border border-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-xs bg-red-500 text-white"
              >
                <i className="fa-regular fa-xmark" />
              </button>
            )}
          </div>
          {errors.image && (
            <p className="text-red-500 text-sm mt-2">{errors.image.message}</p>
          )}
        </div>

        {/* English Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name (English)
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline focus:outline-(--green-color)"
            placeholder="English Name"
            disabled
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Arabic Name Preview */}
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
                disabled
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="text-right mt-4 flex justify-end gap-3">
          {/* {showPreview && (
            <button
              type="button"
              onClick={handleEditPreview}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
            >
              Edit Changes
            </button>
          )} */}

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

export default EditCategoryModel;
