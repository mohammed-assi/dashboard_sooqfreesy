import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const DocumentUpload = ({ documents, setDocuments }) => {
  const MAX_FILES = 3; // Max number of files allowed
  const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // Max total file size (10MB)
  const { register, setValue, formState: { errors } } = useForm();

  const [selectedFile, setSelectedFile] = useState(null); // Store file to view

  // Handle file selection and apply file size/number restrictions
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files); // Convert FileList to array

    // Check file count limit
    if (documents.length + newFiles.length > MAX_FILES) {
      toast.error(`You can upload a maximum of ${MAX_FILES} files.`);
      return;
    }

    // Check total file size limit
    const totalSize = [...documents, ...newFiles].reduce((acc, file) => acc + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      toast.error(`Total file size cannot exceed ${MAX_TOTAL_SIZE / 1024 / 1024}MB.`);
      return;
    }

    // If limits are respected, append files to state and form
    setDocuments((prevDocuments) => {
      const updatedDocuments = [...prevDocuments, ...newFiles];
      setValue("documents", updatedDocuments);
      return updatedDocuments;
    });
  };

  // Remove file from the list
  const handleFileRemove = (index) => {
    const updatedDocuments = [...documents];
    updatedDocuments.splice(index, 1); // Remove file from array
    setDocuments(updatedDocuments);
    setValue("documents", updatedDocuments);
  };

  // Open file in a modal or new window for viewing
  const handleFileView = (file) => {
    if (file.type.startsWith("image")) {
      // If it's an image, show it in a modal
      setSelectedFile({ type: "image", file });
    } else if (file.type === "application/pdf") {
      // If it's a PDF, open in a new tab
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");
    }
  };

  // Close the modal view
  const handleCloseModal = () => {
    setSelectedFile(null);
  };

  return (
    <div className="relative w-full">
      {/* File upload and listing */}
      <label
        htmlFor="documentUpload"
        className="w-full border h-[140px] flex flex-col items-center justify-center border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
      >
        {documents.length > 0 ? (
          <div className="w-full">
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
                <button
                  type="button"
                  onClick={() => handleFileView(file)}
                  className="text-blue-500 text-sm"
                >
                  <i className="fa-solid fa-eye" />
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
        accept=".jpg,.jpeg,.png,.pdf"
        multiple
        {...register("documents")}
        onChange={handleFileChange}
        className="hidden"
      />

      {errors.documents && (
        <p className="text-red-500 text-sm text-center pt-4">
          {errors.documents.message}
        </p>
      )}

      {/* Modal to view selected file (for image files) */}
      {selectedFile && selectedFile.type === "image" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-red-500"
            >
              <i className="fa-regular fa-xmark" />
            </button>
            <img
              src={URL.createObjectURL(selectedFile.file)}
              alt="Selected file"
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
