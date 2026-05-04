import React, { useState } from "react";
import PageMeta from "../../../../common/PageMeta";
import { ROUTES, TITLES } from "../../../../app/constants";
import { Link } from "react-router";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import ReactQuill from "react-quill";
import DatePicker from "react-datepicker";
import DocumentUpload from "../../../../components/DocumentUpload";
import { postRequest } from "../../../../config/apiFunctions";
import { AUTH, DRIVERS } from "../../../../config/endPoints";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  profile_picture: Yup.mixed()
    .required("Please upload a profile image.")
    .test(
      "fileType",
      "Only JPG, JPEG, and PNG files are allowed for profile images.",
      (value) => {
        if (!value || !(value instanceof File)) return true; // Skip validation if no file
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        return allowedTypes.includes(value.type); // Ensure file type matches allowed types
      }
    )
    .test(
      "fileSize",
      "Profile image must be smaller than 10MB.",
      (value) => {
        if (!value || !(value instanceof File)) return true; // Skip validation if no file
        return value.size <= 10 * 1024 * 1024; // Limit to 10MB
      }
    )


  // pdf: Yup.mixed()
  //   .nullable()
  //   .test("pdfType", "Only PDF files are allowed", (value) => {
  //     if (!value || !(value instanceof File)) return true;
  //     return value.type === "application/pdf";
  //   })
  //   .test("fileSize", "PDF must be less than 10MB", (value) => {
  //     if (!value || !(value instanceof File)) return true;
  //     return value.size <= 10 * 1024 * 1024;
  //   }),
  // media: Yup.mixed()
  //   .test("mediaOrPdf", "Either media or PDF is required", function (media) {
  //     const { pdf } = this.parent;
  //     return media instanceof File || pdf instanceof File;
  //   })
  //   .test("fileType", "Invalid media type", (value) => {
  //     if (!value) return true;
  //     const allowedTypes = [
  //       "image/jpeg",
  //       "image/jpg",
  //       "image/png",
  //       "image/gif",
  //       "video/mp4",
  //       "video/webm",
  //       "audio/mpeg",
  //       "audio/wav",
  //     ];
  //     return allowedTypes.includes(value.type);
  //   })
  //   .test("fileSize", "Media must be less than 10MB", (value) => {
  //     if (!value) return true;
  //     return value.size <= 10 * 1024 * 1024;
  //   }),

  // pdf: Yup.mixed()
  //   .test("mediaOrPdf", "Either media or PDF is required", function (pdf) {
  //     const { media } = this.parent;
  //     return pdf instanceof File || media instanceof File;
  //   })
  //   .test("pdfType", "Only PDF files are allowed", (value) => {
  //     if (!value) return true;
  //     return value.type === "application/pdf";
  //   })
  //   .test("fileSize", "PDF must be less than 10MB", (value) => {
  //     if (!value) return true;
  //     return value.size <= 10 * 1024 * 1024;
  //   }),
  ,
  first_name: Yup.string().required("Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  phone: Yup.string().required("Phone Number  is required"),
});

const options = [
  { value: "1", label: "Communication and Language Skills" },
  { value: "2", label: "Social and Emotional Development" },
  { value: "3", label: "Motor Skills Development" },
  { value: "4", label: "Cognitive and Sensory Exploration" },
];

function CreateDriver() {
  const [documents, setDocuments] = useState([])
  console.log(documents, "documents")
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false)
  const dateOfBirth = watch("date_of_birth");
  const handleToggle = () => {
    setIsChecked((prev) => !prev);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleFileRemove = (index) => {
    const updatedDocuments = [...documents];
    updatedDocuments.splice(index, 1); // Remove file from the array
    setDocuments(updatedDocuments);
    setValue("documents", updatedDocuments); // Update form value
  };
  console.log(errors, "qsqsq")
  const onSubmit = async (e) => {
    console.log(e, "kkspkspk2sp")

    setLoading(true);
    const payload = {
      firstName: e.first_name,
      lastName: e.last_name,
      phone: e.phone,
      profileImg: "",
      email: e.email,
      documents: [
        {
          "type": "driving_license_front",
          "fileKey": "driving_license_front",
          "fileExt": ".jpg"
        }
      ]
    };
    try {
      const response = await postRequest(DRIVERS.CREATE, payload);
      if (response.status === 201) {
        setLoading(false);
        toast.success(response?.data?.message, {
          position: "top-right",
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          closeButton: true,
        });
        setShowOtpModal(true);
        reset();
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
    reset()
  };

  return (
    <>
      <PageMeta title={TITLES?.USERS.Create_New_Driver} description="Dashboard" />

      <h1 className="font-semibold text-xl">{TITLES?.USERS.Create_New_Driver}</h1>
      <nav className="flex py-2" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <Link
              to={ROUTES.USERS.drivers}
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-(--green-color)"
            >{TITLES?.USERS.drivers}

            </Link>
          </li>
          {/* <li className="inline-flex items-center">
            <div className="flex items-center text-gray-700">
              <i className="fa-solid fa-chevron-right fa-sm" />
              <Link
                to={ROUTES.CONTENT.topics.root}
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-(--green-color)"
              >
                <span className="ms-1 text-sm font-medium md:ms-2">Topics</span>
              </Link>
            </div>
          </li> */}
          <li aria-current="page">
            <div className="flex items-center text-gray-500">
              <i className="fa-solid fa-chevron-right fa-sm" />
              <span className="ms-1 text-sm font-medium md:ms-2">Create</span>
            </div>
          </li>
        </ol>
      </nav>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
        <div className="grid grid-cols-1 items-start lg:grid-cols-3 gap-6 bg-white p-8 rounded-xl shadow-md">
          <div className="flex flex-col items-center gap-4 col-span-1">
            <div className="w-full flex flex-col items-center justify-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>

              <div className="relative group">
                <label
                  htmlFor="profileUpload"
                  className="cursor-pointer block w-full h-full"
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-32 h-32 object-cover rounded-full border border-gray-300 shadow-sm"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300 hover:bg-gray-200 transition">
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

            {/* <div className="relative w-full h-[240px] max-w-xs rounded-lg border border-dashed border-gray-300 overflow-visible bg-gray-50 hover:bg-gray-100 transition">
              <label
                htmlFor="profileUpload"
                className="w-full h-full block cursor-pointer"
              >
                {mediaPreview ? (
                  mediaPreview.type.startsWith("image/") ? (
                    <img
                      src={mediaPreview.preview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg "
                    />
                  ) : mediaPreview.type.startsWith("video/") ? (
                    <video
                      src={mediaPreview.preview}
                      controls
                      className="w-full h-full object-cover rounded-lg "
                    />
                  ) : mediaPreview.type.startsWith("audio/") ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                      <i className="fa-solid fa-music fa-xl pb-2 text-gray-500" />
                      <audio controls className="w-full">
                        <source
                          src={mediaPreview.preview}
                          type={mediaPreview.type}
                        />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  ) : null
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-sm text-gray-400">
                    <i className="fa-solid fa-photo-film-music fa-2xl pb-4" />
                    Click here to upload media
                  </div>
                )}
              </label>

              <input
                id="profileUpload"
                type="file"
                accept="image/*,video/*,audio/*"
                {...register("media")}
                onChange={(e) => {
                  const file = e.target.files[0];
                  setValue("media", file);

                  if (file) {
                    const isImage = file.type.startsWith("image/");
                    const reader = new FileReader();

                    if (isImage) {
                      reader.onloadend = () =>
                        setMediaPreview({
                          preview: reader.result,
                          type: file.type,
                        });
                      reader.readAsDataURL(file);
                    } else {
                      setMediaPreview({
                        preview: URL.createObjectURL(file),
                        type: file.type,
                      });
                    }
                  } else {
                    setMediaPreview(null);
                  }
                }}
                className="hidden"
              />

              {mediaPreview && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setMediaPreview(null);
                    setValue("media", null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md border-2 border-white"
                >
                  <i className="fa-regular fa-xmark" />
                </button>
              )}
            </div>

            {errors.media && (
              <p className="text-red-500 text-sm">{errors.media.message}</p>
            )} */}
            {/* <div className="flex items-center justify-center pt-4">
              <label className="text-sm font-semibold text-gray-700">PDF</label>
            </div> */}
            <DocumentUpload documents={documents} setDocuments={setDocuments} />
            {/* <div className="relative w-full h-[140px]">
  <label
        htmlFor="documentUpload"
        className="w-full border h-[140px] flex flex-col items-center justify-center border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
      >
        {documents.length > 0 ? (
          <div>
            {documents.map((file, index) => (
              <div key={index} className="flex items-center justify-between text-gray-700 text-sm mt-2">
                <i className="fa-solid fa-file text-gray-500 text-xl mr-2" />
                <span className="truncate flex-1">{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleFileRemove(index)}
                  className="text-red-500 text-sm"
                >
                  <i className="fa-regular fa-xmark" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <>
            <i className="fa-solid fa-file text-3xl text-gray-400 mb-3" />
            <p className="text-sm text-gray-400">Click here to upload documents</p>
          </>
        )}
      </label>

      <input
        id="documentUpload"
        type="file"
        accept=".jpg,.jpeg,.png,.pdf" // Define the accepted file formats
        multiple
        {...register("documents")}
        onChange={handleFileChange} // Handle file selection
        className="hidden"
      />

      {errors.documents && (
        <p className="text-red-500 text-sm text-center pt-4">
          {errors.documents.message}
        </p>
      )}
</div> */}

          </div>
          <div className="col-span-2 grid grid-cols-2 gap-6">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline focus:outline-(--green-color)"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
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
                City
              </label>
              <input
                type="text"
                {...register("city")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline focus:outline-(--green-color)"
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Joined On
              </label>
              <DatePicker
                selected={dateOfBirth}
                onChange={(date) => setValue("date_of_birth", date)}
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
              {errors.date_of_birth && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.date_of_birth.message}
                </p>
              )}
            </div>
            <div className="col-span-2 text-end">

              <button type="submit" disabled={loading} className="primary-button">
                {loading ? "Loading..." : "Submit"}
              </button>

            </div>

          </div>


        </div>
      </form>
    </>
  );
}

export default CreateDriver;
