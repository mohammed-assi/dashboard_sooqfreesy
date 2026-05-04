

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { CONTENTMANAGEMENT } from "../../config/endPoints";
import { getRequest, postRequest } from "../../config/apiFunctions";
import { useNavigate, useParams } from "react-router";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import BackButton from "../../components/TextEditor copy";

/* ---------- Validation ---------- */
const Schema = Yup.object().shape({
  type: Yup.string().trim().required("Type is required"),
  content: Yup.array()
    .of(
      Yup.object().shape({
        title: Yup.object().shape({
          en: Yup.string().trim().required("English title is required"),
          ar: Yup.string().trim().required("Arabic title is required"),
        }),
        description: Yup.object().shape({
          en: Yup.string().trim().required("English description is required"),
          ar: Yup.string().trim().required("Arabic description is required"),
        }),
      })
    )
    .min(1, "At least one item is required"),
});

/* ---------- Main Update Component ---------- */
export default function UpdateContentManagement() {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingFormStructure, setLoadingFormStructure] = useState(false);
  const [contentType, setContentType] = useState("");
  const [files, setFiles] = useState({}); // Store new files separately
  const [existingContent, setExistingContent] = useState([]); // Store existing content

  const navigate = useNavigate();
  const { id } = useParams();
  const formID = atob(id); // decode Base64

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      type: "",
      content: [{ title: { en: "", ar: "" }, description: { en: "", ar: "" } }],
    },
  });

  const selectedType = watch("type");

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "content",
  });

  /* Fetch existing form structure */
  useEffect(() => {
    setLoadingFormStructure(true);
    const fetchStructure = async () => {
      try {
        const res = await getRequest(`${CONTENTMANAGEMENT.EDIT}/${formID}`);
        if (res.data?.success && res.data.data) {
          const data = res.data.data;
          setContentType(data.type);
          setExistingContent(data.content || []);

          // Reset form values with fetched data
          reset({
            type: data.type || "",
            content: data.content.length
              ? data.content
              : [{ title: { en: "", ar: "" }, description: { en: "", ar: "" } }],
          });
          replace(data.content || []);
        }
      } catch (error) {
        toast.error("Failed to fetch content data");
      } finally {
        setLoadingFormStructure(false);
      }
    };
    fetchStructure();
  }, [formID, reset, replace]);

  // Handle file input change
  const handleFileChange = (index, file) => {
    setFiles(prev => ({ ...prev, [index]: file }));
  };

  /* Handle form submission */
  const onSubmit = async (formData) => {
    setLoadingSubmit(true);

    try {
      // Check if we have files to upload
      const hasFiles = Object.keys(files).length > 0;

      if (hasFiles) {
        // Use FormData if we have files
        const form = new FormData();
        // form.append("id", formID);
        form.append("type", formData.type);

        // Prepare content without files for JSON
        const contentWithoutFiles = formData.content.map((item, index) => {
          const { file, ...rest } = item;
          return rest;
        });

        // Send content as JSON string
        form.append("content", JSON.stringify(contentWithoutFiles));

        // Append files with proper keys
        Object.entries(files).forEach(([index, file]) => {
          if (file) {
            form.append(`content[${index}][file]`, file);
          }
        });

        const res = await postRequest(CONTENTMANAGEMENT.UPDATE, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res?.data?.success) {
          toast.success(res.data.message);
          navigate("/contentManagement");
        } else {
          toast.error(res.data?.message || "Failed to update content");
        }
      } else {
        // Use JSON if no files - preserve existing files
        const payload = {
          id: Number(formID),
          type: formData.type,
          content: formData.content.map((item, index) => {
            // Preserve existing file URLs
            if (existingContent[index] && existingContent[index].file) {
              return {
                ...item,
                file: existingContent[index].file
              };
            }
            return item;
          }),
        };

        const res = await postRequest(CONTENTMANAGEMENT.UPDATE, payload);
        if (res.data?.success) {
          toast.success(res.data?.message);
          navigate("/contentManagement");
        } else {
          toast.error(res.data?.message || "Failed to update content");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return ( 
    <div>
      <BackButton />
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
        {/* Content Type Display */}
            <div className="flex gap-2  items-center">
        

        {/* <div className="flex justify-end items-center">
          <button
            onClick={() => setShowCreateModal(true)}
            className="primary-button"
          >
            <i className="fa-solid fa-plus pe-2" />
            New category
          </button>
        </div> */}
      </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content Type
          </label>
          <input
            type="text"
            {...register("type")}
            className="w-full border rounded px-3 py-2 bg-gray-100"
            readOnly
            disabled
          />
          {errors?.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
          )}
        </div>

        {/* Dynamic Items */}
        {fields.map((item, index) => (
          <div
            key={item.id}
            className="border p-4 rounded-md bg-gray-50 mb-4 shadow-sm"
          >
            {/* Title */}
            <div className="grid md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium mb-1">Title (EN)</label>
                <input
                  type="text"
                  {...register(`content.${index}.title.en`)}
                  className="w-full border rounded px-3 py-2 bg-white"
                />
                {errors?.content?.[index]?.title?.en && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.content[index].title.en.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title (AR)</label>
                <input
                  type="text"
                  {...register(`content.${index}.title.ar`)}
                  className="w-full border rounded px-3 py-2 bg-white"
                />
                {errors?.content?.[index]?.title?.ar && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.content[index].title.ar.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description EN */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-2">Content (EN)</label>
              <Controller
                control={control}
                name={`content.${index}.description.en`}
                render={({ field }) => (
                  <ReactQuill
                    theme="snow"
                    value={field.value}
                    onChange={field.onChange}
                    className="bg-white"
                  />
                )}
              />
              {errors?.content?.[index]?.description?.en && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.content[index].description.en.message}
                </p>
              )}
            </div>

            {/* Description AR */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-2">Content (AR)</label>
              <Controller
                control={control}
                name={`content.${index}.description.ar`}
                render={({ field }) => (
                  <ReactQuill
                    theme="snow"
                    value={field.value}
                    onChange={field.onChange}
                    className="bg-white"
                  />
                )}
              />
              {errors?.content?.[index]?.description?.ar && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.content[index].description.ar.message}
                </p>
              )}
            </div>

            {/* File Upload (if HOME_SLIDER) */}
            {contentType === "HOME_SLIDER" && (
              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">
                  {item.file ? "Replace Image" : "Upload Image"}
                </label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(index, e.target.files[0])}
                  className="w-full border rounded px-3 py-2 bg-white"
                />
                {item.file && typeof item.file === 'string' && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Current Image:</p>
                    <img
                      src={item.file}
                      alt="Current"
                      className="h-20 w-auto mt-1 rounded"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Remove Button */}
            {fields.length > 1 && (
              <div className="text-right mt-3">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add More Button */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() =>
              append({ title: { en: "", ar: "" }, description: { en: "", ar: "" } })
            }
            className="secondary-button"
          >
            + Add More
          </button>
        </div>

        {/* Submit */}
        <div className="text-right mt-4">
          <button disabled={loadingSubmit} type="submit" className="primary-button">
            {loadingSubmit ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
      </div>
    );

}