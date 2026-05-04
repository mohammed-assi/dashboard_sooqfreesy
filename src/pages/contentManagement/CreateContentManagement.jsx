import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import { toast } from "react-toastify";
import { postRequest } from "../../config/apiFunctions";
import { CONTENTMANAGEMENT } from "../../config/endPoints";

/* -------------------   Yup Schema ------------------- */
const Schema = Yup.object().shape({
  type: Yup.string().trim().required("Type is required"),
  content: Yup.array().of(
    Yup.object().shape({
      title: Yup.object().shape({
        en: Yup.string().when([], (schemas, schema, { context }) =>
          !context?.isHomeSlider
            ? schema.trim().required("English title is required")
            : schema.nullable()
        ),
        ar: Yup.string().when([], (schemas, schema, { context }) =>
          !context?.isHomeSlider
            ? schema.trim().required("Arabic title is required")
            : schema.nullable()
        ),
      }),
      subtitle: Yup.object().shape({
        en: Yup.string().when([], (schemas, schema, { context }) =>
          context?.isHomeSlider
            ? schema.trim().required("English subtitle is required")
            : schema.nullable()
        ),
        ar: Yup.string().when([], (schemas, schema, { context }) =>
          context?.isHomeSlider
            ? schema.trim().required("Arabic subtitle is required")
            : schema.nullable()
        ),
      }),
      description: Yup.object().shape({
        en: Yup.string().when([], (schemas, schema, { context }) =>
          !context?.isHomeSlider
            ? schema.trim().required("English description is required")
            : schema.nullable()
        ),
        ar: Yup.string().when([], (schemas, schema, { context }) =>
          !context?.isHomeSlider
            ? schema.trim().required("Arabic description is required")
            : schema.nullable()
        ),
      }),
      file: Yup.mixed().when([], (schemas, schema, { context }) =>
        context?.isHomeSlider
          ? schema.required("File is required")
          : schema.nullable()
      ),
    })
  ),
});

/* -------------------   Component ------------------- */
export default function CreateContentManagement() {
  const navigate = useNavigate();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [files, setFiles] = useState({}); // Store files separately

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "",
      content: [
        {
          title: { en: "", ar: "" },
          subtitle: { en: "", ar: "" },
          description: { en: "", ar: "" },
          file: null,
        },
      ],
    },
    resolver: yupResolver(Schema, {
      context: { isHomeSlider: false }, // initial context
    }),
  });

  const selectedType = watch("type");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "content",
  });

  // Update context when type changes
  useEffect(() => {
    const isHomeSlider = selectedType === "HOME_SLIDER";
    // We need to manually re-validate when context changes
  }, [selectedType]);

  // Handle file input change
  const handleFileChange = (index, file) => {
    setValue(`content.${index}.file`, file);
    setFiles(prev => ({ ...prev, [index]: file }));
  };

  /* -------------------   Submit ------------------- */
  const onSubmit = async (data) => {
    setLoadingSubmit(true);
    
    try {
      const form = new FormData();
      form.append("type", data.type);

      // Prepare content without files
      const contentWithoutFiles = data.content.map((item, index) => {
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

      const res = await postRequest(CONTENTMANAGEMENT.CREATE, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res?.data?.success) {
        toast.success(res.data.message);
        navigate("/contentManagement");
      } else {
        toast.error(res?.data?.message || "Submission failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit form");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
      {/* Select Content Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Content Type
        </label>
        <select
          {...register("type")}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select</option>
          <option value="PRIVACY_POLICY">Privacy Policy</option>
          <option value="TERMS_CONDITIONS">Terms & Conditions</option>
          <option value="FAQ">FAQ</option>
          <option value="ABOUT_US">About Us</option>
          
        </select>
        {errors?.type && (
          <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
        )}
      </div>

      {/* Dynamic Content Fields */}
      {fields.map((item, index) => (
        <div
          key={item.id}
          className="border p-4 rounded-md bg-gray-50 mb-4 shadow-sm"
        >
          {/* Titles */}
          <div className="grid md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Title (EN)
              </label>
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
              <label className="block text-sm font-medium mb-1">
                Title (AR)
              </label>
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

          {/* Subtitle (HOME_SLIDER) */}
          {selectedType === "HOME_SLIDER" && (
            <div className="grid md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Subtitle (EN)
                </label>
                <input
                  type="text"
                  {...register(`content.${index}.subtitle.en`)}
                  className="w-full border rounded px-3 py-2 bg-white"
                />
                {errors?.content?.[index]?.subtitle?.en && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.content[index].subtitle.en.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Subtitle (AR)
                </label>
                <input
                  type="text"
                  {...register(`content.${index}.subtitle.ar`)}
                  className="w-full border rounded px-3 py-2 bg-white"
                />
                {errors?.content?.[index]?.subtitle?.ar && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.content[index].subtitle.ar.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Description EN */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-2">
              Content (EN)
            </label>
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
            <label className="block text-sm font-medium mb-2">
              Content (AR)
            </label>
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

          {/* File Upload (HOME_SLIDER) */}
          {selectedType === "HOME_SLIDER" && (
            <div className="mb-3">
              <label className="block text-sm font-medium mb-2">
                Upload Image
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(index, e.target.files[0])}
                className="w-full border rounded px-3 py-2 bg-white"
              />
              {errors?.content?.[index]?.file && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.content[index].file.message}
                </p>
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
            append({
              title: { en: "", ar: "" },
              subtitle: { en: "", ar: "" },
              description: { en: "", ar: "" },
              file: null,
            })
          }
          className="secondary-button"
        >
          + Add More
        </button>
      </div>

      {/* Submit */}
      <div className="text-right mt-4">
        <button
          disabled={loadingSubmit}
          type="submit"
          className="primary-button"
        >
          {loadingSubmit ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}