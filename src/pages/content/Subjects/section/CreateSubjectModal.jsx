import React from "react";
import Modal from "../../../../common/modal/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { postRequest } from "../../../../config/apiFunctions";
import { SUBJECT } from "../../../../config/endPoints";
import { toast } from "react-toastify";

const Schema = Yup.object().shape({
  title: Yup.string().required("Subject name is required"),
});

function CreateSubjectModal({
  showCreateModal,
  setShowCreateModal,
  loading,
  setLoading,
  getSubjectList,
}) {
  const formOptions = { resolver: yupResolver(Schema) };
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  const onSubmit = async (data) => {
    setLoading(true);
    const payload = { title: data.title };
    try {
      const res = await postRequest(SUBJECT.CREATE, payload);
      if (res.data.statusCode === 201) {
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          closeButton: true,
        });
        reset();
        getSubjectList();
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
      title="Create subject"
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

        <div className="text-center">
          <button disabled={loading} type="submit" className="primary-button">
            {loading ? "Loading..." : "Submit"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateSubjectModal;
