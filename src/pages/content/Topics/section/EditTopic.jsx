import React, { useState } from "react";
import PageMeta from "../../../../common/PageMeta";
import { ROUTES, TITLES } from "../../../../app/constants";
import { Link } from "react-router";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import ReactQuill from "react-quill";

const validationSchema = Yup.object().shape({
  media: Yup.mixed()
    .required("Media is required")
    .test(
      "fileType",
      "Only JPG, JPEG, PNG, GIF, MP4, WEBM, and MP3/WAV files are allowed",
      (value) => {
        if (!value || !(value instanceof File)) return true;
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "video/mp4",
          "video/webm",
          "audio/mpeg",
          "audio/wav",
        ];
        return allowedTypes.includes(value.type);
      }
    )
    .test("fileSize", "File size must be less than 10MB", (value) => {
      if (!value || !(value instanceof File)) return true;
      return value.size <= 10 * 1024 * 1024;
    }),
  pdf: Yup.mixed()
    .nullable()
    .test("pdfType", "Only PDF files are allowed", (value) => {
      if (!value || !(value instanceof File)) return true;
      return value.type === "application/pdf";
    })
    .test("fileSize", "PDF must be less than 10MB", (value) => {
      if (!value || !(value instanceof File)) return true;
      return value.size <= 10 * 1024 * 1024;
    }),
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
  name: Yup.string().required("Topic name is required"),
  lesson: Yup.string().required("Lesson is required"),
  description: Yup.string().required("Description is required"),
});

const options = [
  { value: "1", label: "Communication and Language Skills" },
  { value: "2", label: "Social and Emotional Development" },
  { value: "3", label: "Motor Skills Development" },
  { value: "4", label: "Cognitive and Sensory Exploration" },
];

function EditTopic() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [mediaPreview, setMediaPreview] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked((prev) => !prev);
  };

  const onSubmit = (data) => {
    console.log("Submitted data:", data);
    reset();
  };

  return (
    <>
      <PageMeta title={TITLES?.CONTENT.root} description="Dashboard" />

      <h1 className="font-semibold text-xl">{TITLES?.CONTENT.root}</h1>
      <nav className="flex py-2" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <Link
              to={ROUTES.CONTENT.root}
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-(--green-color)"
            >
              Content
            </Link>
          </li>
          <li className="inline-flex items-center">
            <div className="flex items-center text-gray-700">
              <i className="fa-solid fa-chevron-right fa-sm" />
              <Link
                to={ROUTES.CONTENT.topics.root}
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-(--green-color)"
              >
                <span className="ms-1 text-sm font-medium md:ms-2">Topics</span>
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center text-gray-500">
              <i className="fa-solid fa-chevron-right fa-sm" />
              <span className="ms-1 text-sm font-medium md:ms-2">View / Edit</span>
            </div>
          </li>
        </ol>
      </nav>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white p-8 rounded-xl shadow-md">
          <div className="flex flex-col items-center gap-4">
            <label className="text-sm font-semibold text-gray-700">Media</label>
            <div className="relative w-full h-[240px] max-w-xs rounded-lg border border-dashed border-gray-300 overflow-visible bg-gray-50 hover:bg-gray-100 transition">
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
            )}

            <div className="flex items-center justify-center pt-4">
              <label className="text-sm font-semibold text-gray-700">PDF</label>
            </div>

            <div className="relative w-full h-[240px]">
              <label
                htmlFor="pdfUpload"
                className="block w-full border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
              >
                {pdfFile ? (
                  <div className="flex items-center justify-between text-gray-700 text-sm">
                    <i className="fa-solid fa-file-pdf text-red-500 text-xl mr-2" />
                    <span className="truncate flex-1">{pdfFile.name}</span>
                  </div>
                ) : (
                  <>
                    <i className="fa-solid fa-file-pdf fa-2xl text-gray-400 mb-4" />
                    <p className="text-sm text-gray-400">
                      Click here to upload PDF
                    </p>
                  </>
                )}
              </label>

              <input
                id="pdfUpload"
                type="file"
                accept="application/pdf"
                {...register("pdf")}
                onChange={(e) => {
                  const file = e.target.files[0];
                  setValue("pdf", file);
                  if (file) setPdfFile(file);
                  else setPdfFile(null);
                }}
                className="hidden"
              />

              {pdfFile && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setPdfFile(null);
                    setValue("pdf", null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md border-2 border-white"
                >
                  <i className="fa-regular fa-xmark" />
                </button>
              )}

              {errors.pdf && (
                <p className="text-red-500 text-sm text-center pt-4">
                  {errors.pdf.message}
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                {...register("name")}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-orange-400"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lesson
              </label>
              <Controller
                name="lesson"
                control={control}
                render={({ field }) => (
                  <Select
                    value={
                      options.find((opt) => opt.value === field.value) || null
                    }
                    onChange={(option) => field.onChange(option?.value || "")}
                    options={options}
                    isClearable
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Select lesson"
                  />
                )}
              />
              {errors.lesson && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lesson.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <ReactQuill
                    {...field}
                    theme="snow"
                    className="custom-quill bg-white"
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
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

            <div className="text-end pt-4">
              <button
                type="submit"
                className="bg-main-500 hover:bg-main-700 text-white font-medium py-2 px-6 rounded-lg shadow transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default EditTopic;
