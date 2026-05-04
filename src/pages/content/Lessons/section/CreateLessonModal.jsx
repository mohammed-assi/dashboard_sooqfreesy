import React, { useState } from "react";
import Modal from "../../../../common/modal/Modal";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Select from "react-select";
import { toast } from "react-toastify";
import { postRequest } from "../../../../config/apiFunctions";
import { LESSON } from "../../../../config/endPoints";

const Schema = Yup.object().shape({
  icon: Yup.mixed()
    .test("file-required", "Icon is required", (value) => {
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
  subject: Yup.string().required("Subject is required"),
});

function CreateLessonModal({
  showCreateModal,
  setShowCreateModal,
  loading,
  setLoading,
  getLessonList,
  subjectList,
}) {
  const formOptions = { resolver: yupResolver(Schema) };
  const { register, handleSubmit, reset, control, formState, setValue } =
    useForm(formOptions);
  const { errors } = formState;

  const [previewImage, setPreviewImage] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    let formData = new FormData();

    formData.append("title", data.title);
    formData.append("subjectId", data.subject);
    if (data.icon instanceof File) {
      formData.append("media", data.icon);
    }
    try {
      const res = await postRequest(LESSON.CREATE, formData);
      if (res?.status === 201) {
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          closeButton: true,
        });
        reset();
        getLessonList();
        setShowCreateModal(false);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error, {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        closeButton: true,
      });
      reset();
      setLoading(false);
    }
    setShowCreateModal(false);
  };

  return (
    <Modal
      isOpen={showCreateModal}
      onClose={() => setShowCreateModal(false)}
      title="Create lesson"
      position="right"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6"
      >
        <div className="w-full flex flex-col items-center justify-center">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lesson icon
          </label>

          <div className="relative group w-40 h-30">
            <label
              htmlFor="profileUpload"
              className="cursor-pointer block w-full h-full"
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-40 h-30 rounded object-cover border border-gray-300 shadow-sm"
                />
              ) : (
                <div className="w-40 h-30 rounded bg-gray-100 flex items-center justify-center border border-gray-300 hover:bg-gray-200 transition">
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
                className="absolute top-0 right-0 -mt-2 -mr-2 border border-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-xs bg-red-500 text-white"
              >
                <i className="fa-regular fa-xmark" />
              </button>
            )}
          </div>

          {errors.icon && (
            <p className="text-red-500 text-sm mt-2">{errors.icon.message}</p>
          )}
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lesson name
          </label>
          <input
            type="text"
            {...register("title")}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline focus:outline-(--green-color)"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <Controller
            name="subject"
            control={control}
            render={({ field }) => (
              <Select
                value={
                  subjectList?.find((opt) => opt.id === field.value) || null
                }
                onChange={(option) => field.onChange(option ? option.id : "")}
                options={subjectList}
                isClearable
                getOptionLabel={(e) => e.title}
                getOptionValue={(e) => e.id.toString()}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select Subject"
              />
            )}
          />
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">
              {errors.subject.message}
            </p>
          )}
        </div>

        <div className="text-center">
          <button disabled={loading} type="submit" className="primary-button">
            {loading ? "Loading..." : "Submit"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateLessonModal;
