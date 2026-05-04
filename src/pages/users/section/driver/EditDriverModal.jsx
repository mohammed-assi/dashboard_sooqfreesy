import React, { useEffect, useState } from "react";
import Modal from "../../../../common/modal/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import { putRequest } from "../../../../config/apiFunctions";
import { USERS } from "../../../../config/endPoints";
import { toast } from "react-toastify";

const Schema = Yup.object().shape({
  profile_picture: Yup.mixed()
    // .test("file-required", "Profile picture is required", (value) => {
    //   return value instanceof File;
    // })
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
  // access_code: Yup.string().required("Code is required"),
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number must contain only digits"),
  date_of_birth: Yup.date().required("Date of birth is required"),
  role: Yup.string().required("Role is required"),
  grade: Yup.string().when("role", {
    is: "STUDENT",
    then: (schema) => schema.required("Grade is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  parent_profile_picture: Yup.mixed().when("role", {
    is: "STUDENT",
    then: (schema) =>
      schema
        // .test("file-required", "Profile picture is required", (value) => {
        //   return value instanceof File;
        // })
        .test("file-size", "File size must be less than 5MB", (value) => {
          if (!(value instanceof File)) return true;
          return value.size <= 5 * 1024 * 1024;
        })
        .test(
          "file-type",
          "Only JPG, JPEG, and PNG formats are allowed",
          (value) => {
            if (!(value instanceof File)) return true;
            return ["image/jpeg", "image/png", "image/jpg"].includes(
              value.type
            );
          }
        ),
    otherwise: (schema) => schema.notRequired(),
  }),

  // parent_access_code: Yup.string().when("role", {
  //   is: "1",
  //   then: (schema) => schema.required("Access code is required"),
  //   otherwise: (schema) => schema.notRequired(),
  // }),

  parent_first_name: Yup.string().when("role", {
    is: "STUDENT",
    then: (schema) => schema.required("First Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  parent_last_name: Yup.string().when("role", {
    is: "STUDENT",
    then: (schema) => schema.required("Last Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  parent_email: Yup.string().when("role", {
    is: "STUDENT",
    then: (schema) =>
      schema.email("Invalid Email").required("Email is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  parent_phone: Yup.string().when("role", {
    is: "STUDENT",
    then: (schema) =>
      schema
        .required("Phone number is required")
        .matches(/^[0-9]+$/, "Phone number must contain only digits"),
    otherwise: (schema) => schema.notRequired(),
  }),

  parent_date_of_birth: Yup.date().when("role", {
    is: "STUDENT",
    then: (schema) => schema.required("Date of birth is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

function EditDriverModal({
  showEditModal,
  setShowEditModal,
  userDetails,
  userListCallBack,
}) {
  const roles = [
    { name: "Student", id: "STUDENT" },
    { name: "Teacher", id: "TEACHER" },
    { name: "Parent", id: "PARENT" },
  ];
  const imagePath = import.meta.env.VITE_APP_MEDIA_FILE_URL;
  const formOptions = { resolver: yupResolver(Schema) };
  const { register, handleSubmit, reset, formState, watch, setValue } =
    useForm(formOptions);
  const { errors } = formState;

  const dateOfBirth = watch("date_of_birth");
  const parentDateOfBirth = watch("parent_date_of_birth");
  const [previewImage, setPreviewImage] = useState(null);
  const [parentPreviewImage, setParentPreviewImage] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    let formData = new FormData();
    const payloadData = {
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      phone: data.phone,
      dateofBirth: data.date_of_birth,
      role: data.role,
    };

    Object.keys(payloadData).forEach(function (key) {
      formData.append(key, payloadData[key]);
    });

    if (data.profile_picture instanceof File) {
      formData.append("profilePicture", data.profile_picture);
    }
    if (roleId === "STUDENT") {
      if (data.parent_profile_picture instanceof File) {
        formData.append("parentProfilePicture", data.parent_profile_picture);
      }
      formData.append("parentFirstName", data.parent_first_name);
      formData.append("parentLastName", data.parent_last_name);
      formData.append("parentEmail", data.parent_email);
      formData.append("parentPhone", data.parent_phone);
      formData.append("parentDateofBirth", data.parent_date_of_birth);
      formData.append("currentGrade", data.grade);
    }
    try {
      const res = await putRequest(
        `${USERS.EDIT}/${userDetails?.id}`,
        formData
      );
      if (res.data.statusCode === 200) {
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          closeButton: true,
        });
        reset();
        setShowEditModal(false);
        userListCallBack();
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response.data, {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        closeButton: true,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userDetails) {
      setValue("first_name", userDetails?.firstName || "");
      setValue("last_name", userDetails?.lastName || "");
      setValue("email", userDetails?.email || "");
      setValue("date_of_birth", userDetails?.dateofBirth || null);
      setValue("phone", userDetails?.phone || "");
      setValue("role", userDetails?.role || "");
      setRoleId(userDetails?.role || "");

      // Handle profile picture
      if (userDetails?.profilePicture) {
        setPreviewImage(`${imagePath}/${userDetails?.profilePicture}`);
        setValue("profile_picture", userDetails?.profilePicture);
      } else {
        setPreviewImage(null); // clear previous image
        setValue("profile_picture", "");
      }

      if (userDetails?.role === "STUDENT") {
        setValue("grade", userDetails?.details?.currentGrade || "");
        setValue(
          "parent_first_name",
          userDetails?.details?.parents?.users?.firstName || ""
        );
        setValue(
          "parent_last_name",
          userDetails?.details?.parents?.users?.lastName || ""
        );
        setValue(
          "parent_email",
          userDetails?.details?.parents?.users?.email || ""
        );
        setValue(
          "parent_date_of_birth",
          userDetails?.details?.parents?.users?.dateofBirth || null
        );
        setValue(
          "parent_phone",
          userDetails?.details?.parents?.users?.phone || ""
        );

        // Handle parent profile picture
        if (userDetails?.details?.parents?.users?.profilePicture) {
          setParentPreviewImage(
            `${imagePath}/${userDetails?.details?.parents?.users?.profilePicture}`
          );
          setValue(
            "parent_profile_picture",
            userDetails?.details?.parents?.users?.profilePicture
          );
        } else {
          setParentPreviewImage(null); // clear previous parent image
          setValue("parent_profile_picture", "");
        }
      } else {
        // Clear parent preview and parent fields if not STUDENT
        setParentPreviewImage(null);
        setValue("grade", "");
        setValue("parent_first_name", "");
        setValue("parent_last_name", "");
        setValue("parent_email", "");
        setValue("parent_date_of_birth", null);
        setValue("parent_phone", "");
        setValue("parent_profile_picture", "");
      }
    }
  }, [userDetails, setValue]);

  return (
    <>
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit user"
        position="right"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-6"
        >
          <div className="w-full flex flex-col items-center justify-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
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
                {...register("profile_picture")}
                onChange={(e) => {
                  const file = e.target.files[0];
                  setValue("profile_picture", file);
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
                    setValue("profile_picture", null);
                  }}
                  className="absolute top-2 right-6 -mt-2 -mr-2 border border-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-xs bg-red-500 text-white"
                >
                  <i className="fa-regular fa-xmark" />
                </button>
              )}
            </div>

            {errors.profile_picture && (
              <p className="text-red-500 text-sm mt-2">
                {errors.profile_picture.message}
              </p>
            )}
          </div>

          {/* <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Access Code
            </label>
            <input
              type="text"
              {...register("access_code")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline focus:outline-(--green-color)"
            />
            {errors.access_code && (
              <p className="text-red-500 text-sm mt-1">
                {errors.access_code.message}
              </p>
            )}
          </div> */}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                {...register("first_name")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline focus:outline-(--green-color)"
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                {...register("last_name")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline focus:outline-(--green-color)"
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              disabled
              {...register("email")}
              className="w-full bg-gray-200 border border-gray-300 rounded-md px-3 py-2 focus:outline focus:outline-(--green-color)"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                {...register("phone")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline focus:outline-(--green-color) appearance-none"
                onKeyDown={(e) => {
                  // Allow: backspace, delete, arrows
                  if (
                    [
                      "Backspace",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                    ].includes(e.key)
                  ) {
                    return;
                  }

                  // Block non-numeric keys
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <DatePicker
                selected={dateOfBirth}
                onChange={(date) => setValue("date_of_birth", date)}
                dateFormat="MM-dd-yyyy"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline focus:outline-(--green-color)"
                placeholderText="Select a date"
                maxDate={new Date()}
                showMonthDropdown
                useShortMonthInDropdown
                showYearDropdown
                dateFormatCalendar="MMMM"
                yearDropdownItemNumber={70}
                scrollableYearDropdown
              />
              {errors.date_of_birth && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.date_of_birth.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                {...register("role")}
                disabled
                onChange={(e) => setRoleId(e.target.value)}
                className="w-full border bg-gray-200 border-gray-300 rounded-md px-3 py-2 focus:outline focus:outline-(--green-color)"
              >
                <option value="">-- Select Role --</option>
                {roles.map((item, i) => (
                  <option key={i} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            {roleId === "STUDENT" && (
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Grade
                </label>
                <input
                  type="text"
                  {...register("grade")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline focus:outline-(--green-color)"
                />
                {errors.grade && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.grade.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {roleId === "STUDENT" && (
            <>
              <h3 className="block text-md font-medium mb-2 text-(--green-color)">
                Edit parent or guardian details
              </h3>
              <div className="w-full flex flex-col items-center justify-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>

                <div className="relative group w-25 h-25">
                  <label
                    htmlFor="parentProfileUpload"
                    className="cursor-pointer block w-full h-full"
                  >
                    {parentPreviewImage ? (
                      <img
                        src={parentPreviewImage}
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
                    id="parentProfileUpload"
                    type="file"
                    accept="image/*"
                    {...register("parent_profile_picture")}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setValue("parent_profile_picture", file);
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () =>
                          setParentPreviewImage(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />

                  {parentPreviewImage && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setParentPreviewImage(null);
                        setValue("parent_profile_picture", null);
                      }}
                      className="absolute top-2 right-6 -mt-2 -mr-2 border border-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-xs bg-red-500 text-white"
                    >
                      <i className="fa-regular fa-xmark" />
                    </button>
                  )}
                </div>

                {errors.parent_profile_picture && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.parent_profile_picture.message}
                  </p>
                )}
              </div>

              {/* <div className="w-full">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Access Code
                          </label>
                          <input
                            type="text"
                            {...register("parent_access_code")}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline focus:outline-(--green-color)"
                          />
                          {errors.parent_access_code && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.parent_access_code.message}
                            </p>
                          )}
                        </div> */}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <inputs
                    type="text"
                    {...register("parent_first_name")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline focus:outline-(--green-color)"
                  />
                  {errors.parent_first_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.parent_first_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    {...register("parent_last_name")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline focus:outline-(--green-color)"
                  />
                  {errors.parent_last_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.parent_last_name.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  disabled
                  {...register("parent_email")}
                  className="w-full bg-gray-200 border border-gray-300 rounded-md px-3 py-2 focus:outline focus:outline-(--green-color)"
                />
                {errors.parent_email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.parent_email.message}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    {...register("parent_phone")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline focus:outline-(--green-color) appearance-none"
                    onKeyDown={(e) => {
                      if (
                        [
                          "Backspace",
                          "Delete",
                          "ArrowLeft",
                          "ArrowRight",
                          "Tab",
                        ].includes(e.key)
                      ) {
                        return;
                      }
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {errors.parent_phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.parent_phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <DatePicker
                    selected={parentDateOfBirth}
                    onChange={(date) => setValue("parent_date_of_birth", date)}
                    dateFormat="MM/dd/yyyy"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline focus:outline-(--green-color)"
                    placeholderText="Select a date"
                    maxDate={new Date()}
                    showMonthDropdown
                    useShortMonthInDropdown
                    showYearDropdown
                    dateFormatCalendar="MMMM"
                    yearDropdownItemNumber={70}
                    scrollableYearDropdown
                  />
                  {errors.parent_date_of_birth && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.parent_date_of_birth.message}
                    </p>
                  )}
                </div>
              </div>

              {/* <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Role
                            </label>
                            <select
                              {...register("parent_role")}
                              onChange={(e) => setRoleId(e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline focus:outline-(--green-color)"
                              disabled
                            >
                              <option value="PARENT">Parent</option>
                            </select>
                            {errors.parent_role && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.parent_role.message}
                              </p>
                            )}
                          </div>
                        </div> */}
            </>
          )}

          <div className="text-right mt-4">
            <button disabled={loading} type="submit" className="primary-button">
              {loading ? "Loading..." : "Submit"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default EditDriverModal;
