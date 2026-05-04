import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { CATEGORY, FORMSTRUCTURE } from "../../config/endPoints";
import { getRequest, postRequest } from "../../config/apiFunctions";
import { useNavigate } from "react-router-dom";

/* ---------- Validation Schema ---------- */
const optionSchema = Yup.object({
  value: Yup.string().trim().required("Option value is required"),
});

const fieldSchema = Yup.object({
  label: Yup.string().trim().required("Field label is required"),
  name: Yup.string().trim().required("Field name is required"),
  type: Yup.string()
    .oneOf([
      "text",
      "textarea",
      "dropdown",
      "checkbox",
      "date",
      "dropdown_api",
      "checkbox_api",
      "radio",
      "number",
    ])
    .required("Field type is required"),
  placeholder: Yup.string().nullable(),
  required: Yup.boolean().default(false),
  options: Yup.array()
    .of(optionSchema)
    .default([])
    .test("opts-required", "Add at least one valid option", function (value) {
      const { type } = this.parent;
      if (type === "dropdown" || type === "checkbox" || type === "radio") {
        return (
          Array.isArray(value) &&
          value.length > 0 &&
          value.every((opt) => opt.value.trim().length > 0)
        );
      }
      return true;
    }),
  system: Yup.boolean().default(false),
});

const Schema = Yup.object({
  mainCategory: Yup.string().required("Main Category is required"),
  subCategory: Yup.string().required("Sub Category is required"),
  fields: Yup.array().of(fieldSchema).min(1, "Add at least one field"),
});

/* ---------- Field Row Component ---------- */
function FieldRow({ index, control, register, errors, onRemove }) {
  const type = useWatch({ control, name: `fields.${index}.type` });
  const isSystem = useWatch({ control, name: `fields.${index}.system` });

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: `fields.${index}.options`,
  });

  useEffect(() => {
    if (
      !isSystem &&
      (type === "dropdown" || type === "checkbox" || type === "radio") &&
      optionFields.length === 0
    ) {
      appendOption({ value: "" });
    }
  }, [type]);

  const fieldErrors = errors?.fields?.[index] || {};

  return (
    <div className="grid md:grid-cols-2 gap-4 border p-3 mb-3 rounded-md relative bg-gray-50">
      {/* Label */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Label (English)
        </label>
        <input
          type="text"
          {...register(`fields.${index}.label`)}
          className="w-full border rounded px-3 py-2"
        />
        {fieldErrors?.label && (
          <p className="text-red-500 text-sm mt-1">
            {fieldErrors.label.message}
          </p>
        )}
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          {...register(`fields.${index}.name`)}
          className="w-full border rounded px-3 py-2"
        />
        {fieldErrors?.name && (
          <p className="text-red-500 text-sm mt-1">
            {fieldErrors.name.message}
          </p>
        )}
      </div>

      {/* Placeholder */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Placeholder (English)
        </label>
        <input
          type="text"
          {...register(`fields.${index}.placeholder`)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <select
          {...register(`fields.${index}.type`)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="text">Text</option>
          <option value="textarea">Text Area</option>
          <option value="number">Number</option>
          <option value="date">Date</option>
          <option value="dropdown">Dropdown Manual</option>
          <option value="dropdown_api">Dropdown API</option>
          <option value="checkbox">Checkbox Manual</option>
          <option value="checkbox_api">Checkbox API</option>
          <option value="radio">Radio</option>
        </select>
      </div>

      {/* Required */}
      <div className="col-span-2 flex items-center">
        <input
          type="checkbox"
          {...register(`fields.${index}.required`)}
          className="mr-2"
        />
        <label>Is Mandatory?</label>
      </div>

      {/* Options */}
      {(type === "dropdown" || type === "checkbox" || type === "radio") && (
        <div className="col-span-2">
          <h4 className="font-medium text-sm mb-2">Options (English)</h4>
          {optionFields.map((opt, optIndex) => (
            <div key={opt.id} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                {...register(`fields.${index}.options.${optIndex}.value`)}
                className="border rounded px-2 py-1 flex-grow"
                placeholder="Option in English"
              />
              <button
                type="button"
                onClick={() => removeOption(optIndex)}
                className="text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendOption({ value: "" })}
            className="secondary-button text-sm mt-2"
          >
            + Add Option
          </button>
        </div>
      )}

      {!isSystem && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 text-red-500"
        >
          ✕
        </button>
      )}
    </div>
  );
}

/* ---------- Main Component ---------- */
export default function CreateStructure() {
  const navigate = useNavigate();
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [mainCategoryList, setMainCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [originalFormData, setOriginalFormData] = useState(null);

  const {
    register,
    watch,
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      mainCategory: "",
      subCategory: "",
      fields: [
        {
          label: "Title",
          name: "title",
          type: "text",
          placeholder: "Enter title",
          required: true,
          options: [],
          system: true,
        },
        {
          label: "Description",
          name: "description",
          type: "textarea",
          placeholder: "Enter description",
          required: true,
          options: [],
          system: true,
        },
        {
          label: "Price(USD)",
          name: "price",
          type: "text",
          placeholder: "Enter price",
          required: true,
          options: [],
          system: true,
        },
        {
          label: "Price(SYP)",
          name: "price_syp",
          type: "text",
          placeholder: "Enter price in SYP",
          required: true,
          options: [],
          system: true,
        },
      ],
    },
  });

  const selectedMainCat = watch("mainCategory");
  const { fields, append, remove } = useFieldArray({ control, name: "fields" });

  useEffect(() => {
    const fetchMainCats = async () => {
      setLoadingCategories(true);
      try {
        const res = await getRequest(CATEGORY.LIST);
        if (res.data?.success)
          setMainCategoryList(res.data.data?.categories || []);
        else toast.error(res.data?.message || "Failed to load categories");
      } catch {
        toast.error("Failed to load main categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchMainCats();
  }, []);

  useEffect(() => {
    if (!selectedMainCat) return setSubCategoryList([]);

    const fetchSubCats = async () => {
      setLoadingSubCategories(true);
      try {
        const res = await getRequest(
          `${FORMSTRUCTURE.SUBBYCATID}/${selectedMainCat}`
        );
        if (res.data?.success) setSubCategoryList(res.data?.data || []);
        else toast.error(res.data?.message || "Failed to load subcategories");
      } catch {
        setSubCategoryList([]);
      } finally {
        setLoadingSubCategories(false);
      }
    };
    fetchSubCats();
  }, [selectedMainCat]);

  /* Get preview data from API */
  const handlePreview = async () => {
    const data = getValues();
    setLoadingPreview(true);
    try {
      const payload = {
        category_id: Number(data.mainCategory),
        sub_category_id: Number(data.subCategory),
        form_data: data.fields,
      };

      const res = await postRequest(FORMSTRUCTURE.CREATE, payload, {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "en",
        },
      });

      if (res.data?.success) {
        setPreviewData(res.data.data.form_data);
        setOriginalFormData(data.fields); // Store original English data
        setShowPreview(true);
      } else {
        toast.error(res.data?.message || "Failed to generate preview");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate preview");
    } finally {
      setLoadingPreview(false);
    }
  };

  /* Handle field changes in preview */
  const handleFieldChange = (index, field, value) => {
    const updatedData = [...previewData];

    if (field === "label" || field === "placeholder") {
      updatedData[index] = {
        ...updatedData[index],
        [field]: {
          ...updatedData[index][field],
          ar: value,
        },
      };
    }

    setPreviewData(updatedData);
  };

  /* Handle option changes in preview */
  const handleOptionChange = (fieldIndex, optionIndex, value) => {
    const updatedData = [...previewData];

    updatedData[fieldIndex] = {
      ...updatedData[fieldIndex],
      options: updatedData[fieldIndex].options.map((opt, idx) =>
        idx === optionIndex
          ? {
              ...opt,
              value: {
                ...opt.value,
                ar: value,
              },
            }
          : opt
      ),
    };

    setPreviewData(updatedData);
  };

  /* Transform data for final submission */
  const transformDataForSubmission = () => {
    // Use the preview data that has both English and Arabic translations
    return previewData.map((field, index) => {
      const baseField = {
        label: field.label,
        name: field.name,
        type: field.type,
        placeholder: field.placeholder,
        required: field.required,
        system: field.system,
      };

      // Handle options for field types that have them
      if (field.options && field.options.length > 0) {
        return {
          ...baseField,
          options: field.options.map((opt) => ({
            value: opt.value,
          })),
        };
      }

      return baseField;
    });
  };

  /* Final submit with both languages */
  const confirmSubmit = async () => {
    setLoadingSubmit(true);
    try {
      const transformedData = transformDataForSubmission();

      const finalPayload = {
        category_id: Number(getValues("mainCategory")),
        sub_category_id: Number(getValues("subCategory")),
        form_data: transformedData,
      };

      console.log("Final payload being sent:", finalPayload);

      const url = `${FORMSTRUCTURE.CREATE}?isFormCreated=true`;

      const res = await postRequest(url, finalPayload, {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "en",
        },
      });
      console.log(res);

      if (res.data?.success) {
        toast.success("Form structure created successfully!");
        navigate("/structure");
      } else {
        toast.error(res.data?.message || "Submission failed");
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error(err.response?.data?.message || "Failed to submit form");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(handlePreview)} className="grid gap-6">
        {/* Main Category */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Select Main Category
          </label>
          <select
            {...register("mainCategory")}
            className="w-full border rounded px-3 py-2"
            disabled={loadingCategories}
          >
            <option value="">Select</option>
            {mainCategoryList.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors?.mainCategory && (
            <p className="text-red-500 text-sm mt-1">
              {errors.mainCategory.message}
            </p>
          )}
        </div>

        {/* Sub Category */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Select Sub Category
          </label>
          <select
            {...register("subCategory")}
            className="w-full border rounded px-3 py-2"
            disabled={loadingSubCategories}
          >
            <option value="">Select</option>
            {subCategoryList.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors?.subCategory && (
            <p className="text-red-500 text-sm mt-1">
              {errors.subCategory.message}
            </p>
          )}
        </div>

        {/* Fields */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Form Fields (English)</h3>
          {fields.map((fld, index) => (
            <FieldRow
              key={fld.id}
              index={index}
              control={control}
              register={register}
              errors={errors}
              onRemove={() => remove(index)}
            />
          ))}
          <button
            type="button"
            onClick={() =>
              append({
                label: "",
                name: "",
                type: "text",
                placeholder: "",
                required: false,
                options: [],
                system: false,
              })
            }
            className="secondary-button"
          >
            + Add Field
          </button>
        </div>

        <div className="text-right mt-4">
          <button
            type="submit"
            className="primary-button"
            disabled={loadingPreview}
          >
            {loadingPreview ? "Generating Preview..." : "Preview & Confirm"}
          </button>
        </div>
      </form>

      {/* ---------- Arabic Preview Modal ---------- */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl relative max-h-[85vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              Arabic Preview - Edit Arabic Translations
            </h2>

            {previewData?.map((field, index) => (
              <div key={index} className="mb-4 border-b pb-4">
                {/* Field Name (for reference) */}
                <div className="text-sm text-gray-500 mb-2">
                  Field Name: {field.name}
                </div>

                {/* Label in Arabic */}
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">
                    Label (العنوان)
                  </label>
                  <input
                    type="text"
                    value={field.label?.ar || ""}
                    placeholder="أدخل العنوان بالعربية"
                    className="w-full border rounded px-3 py-2"
                    onChange={(e) =>
                      handleFieldChange(index, "label", e.target.value)
                    }
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    English: {field.label?.en}
                  </div>
                </div>

                {/* Placeholder in Arabic */}
                {field.type !== "dropdown" &&
                  field.type !== "checkbox" &&
                  field.type !== "radio" && (
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">
                        Placeholder (العنوان النائب)
                      </label>
                      {field.type === "textarea" ? (
                        <textarea
                          value={field.placeholder?.ar || ""}
                          placeholder="أدخل النص التوضيحي بالعربية"
                          className="w-full border rounded px-3 py-2"
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "placeholder",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        <input
                          type="text"
                          value={field.placeholder?.ar || ""}
                          placeholder="أدخل النص التوضيحي بالعربية"
                          className="w-full border rounded px-3 py-2"
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "placeholder",
                              e.target.value
                            )
                          }
                        />
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        English: {field.placeholder?.en}
                      </div>
                    </div>
                  )}

                {/* Options for dropdown, radio, checkbox */}
                {(field.type === "dropdown" ||
                  field.type === "radio" ||
                  field.type === "checkbox") && (
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-2">
                      Options (الخيارات) - Arabic
                    </label>
                    {field.options?.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center gap-2 mb-2"
                      >
                        <input
                          type="text"
                          value={option.value?.ar || ""}
                          placeholder="الخيار بالعربية"
                          className="w-full border rounded px-3 py-2"
                          onChange={(e) =>
                            handleOptionChange(
                              index,
                              optionIndex,
                              e.target.value
                            )
                          }
                        />
                        <div className="text-xs text-gray-500 min-w-[100px]">
                          EN: {option.value?.en}
                        </div>
                      </div>
                    ))}

                    {/* Preview */}
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <label className="block text-sm font-medium mb-2">
                        Preview (معاينة)
                      </label>
                      {field.type === "dropdown" && (
                        <select className="w-full border rounded px-3 py-2">
                          <option value="">اختر...</option>
                          {field.options?.map((option, i) => (
                            <option key={i} value={option.value?.en}>
                              {option.value?.ar || option.value?.en}
                            </option>
                          ))}
                        </select>
                      )}

                      {field.type === "radio" && (
                        <div className="space-y-2">
                          {field.options?.map((option, i) => (
                            <label key={i} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`preview-${field.name}`}
                              />
                              <span>
                                {option.value?.ar || option.value?.en}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}

                      {field.type === "checkbox" && (
                        <div className="space-y-2">
                          {field.options?.map((option, i) => (
                            <label key={i} className="flex items-center gap-2">
                              <input type="checkbox" />
                              <span>
                                {option.value?.ar || option.value?.en}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowPreview(false)}
                className="secondary-button"
              >
                Back
              </button>
              <button
                onClick={confirmSubmit}
                disabled={loadingSubmit}
                className="primary-button"
              >
                {loadingSubmit ? "جاري الحفظ..." : "Confirm & Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
