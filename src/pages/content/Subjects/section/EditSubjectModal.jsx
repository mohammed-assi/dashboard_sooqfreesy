import React, { useEffect, useState } from "react";
import Modal from "../../../../common/modal/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { SUBJECT } from "../../../../config/endPoints";
import { putRequest } from "../../../../config/apiFunctions";

const Schema = Yup.object().shape({
  title: Yup.string().required("Subject name is required"),
});

function EditSubjectModal({
  showEditModal,
  setShowEditModal,
  loading,
  setLoading,
  getSubjectList,
  subjectDetails,
}) {
  const formOptions = { resolver: yupResolver(Schema) };
  const { register, handleSubmit, formState, setValue } =
    useForm(formOptions);
  const { errors } = formState;

  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked((prev) => !prev);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const payload = {
      id: subjectDetails?.id,
      title: data.title,
      status: isChecked ? 1 : 0,
    };
    try {
      const res = await putRequest(SUBJECT.EDIT, payload);
      if (res.data.statusCode === 201) {
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          closeButton: true,
        });
        getSubjectList();
        setShowEditModal(false);
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
      setLoading(false);
    }
    setShowEditModal(false);
  };

  useEffect(() => {
    if (subjectDetails) {
      setValue("title", subjectDetails?.title);
      setIsChecked(subjectDetails?.status === 1 ? true : false);
    }
  }, [subjectDetails, setValue]);

  return (
    <Modal
      isOpen={showEditModal}
      onClose={() => setShowEditModal(false)}
      title="Edit subject"
      position="center"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6"
      >
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject name
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

        <div className="flex items-center justify-end w-full">
          <label
            htmlFor="toggle"
            className="text-sm font-medium text-gray-900 dark:text-gray-300 pe-5"
          >
            Publish
          </label>

          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="toggle"
              checked={isChecked}
              onChange={handleToggle}
              className="sr-only peer"
            />
            <div
              className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 
      peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
      peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] 
      after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
      after:transition-all dark:border-gray-600 peer-checked:bg-main-500 dark:peer-checked:bg-main-500"
            ></div>
          </label>
        </div>
        <div className="text-center">
          <button type="submit" className="primary-button">
            {loading ? "Loading..." : "Submit"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default EditSubjectModal;
