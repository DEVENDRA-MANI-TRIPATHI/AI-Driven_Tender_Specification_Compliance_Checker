import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  onCompare: (referenceFile: File, userFile: File) => void;
}

const DocumentInput: React.FC<Props> = ({ onCompare }) => {
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [userFile, setUserFile] = useState<File | null>(null);

  const handleDrop = (setter: React.Dispatch<React.SetStateAction<File | null>>) =>
    useCallback((acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file && file.type === "application/pdf") {
        setter(file);
      } else {
        alert("Only PDF files are supported.");
      }
    }, []);

  const {
    getRootProps: getRefRootProps,
    getInputProps: getRefInputProps,
    isDragActive: isRefActive,
  } = useDropzone({
    onDrop: handleDrop(setReferenceFile),
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
  });

  const {
    getRootProps: getUserRootProps,
    getInputProps: getUserInputProps,
    isDragActive: isUserActive,
  } = useDropzone({
    onDrop: handleDrop(setUserFile),
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (referenceFile && userFile) {
      onCompare(referenceFile, userFile);
    } else {
      alert("Please upload both reference and user PDF files.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Upload PDF Documents</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Reference Document Dropzone */}
        <div>
          <label className="block text-lg font-semibold mb-2 text-gray-700">
            Reference Document
          </label>
          <div
            {...getRefRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
              isRefActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
          >
            <input {...getRefInputProps()} />
            {referenceFile ? (
              <p className="text-green-700 font-medium">{referenceFile.name}</p>
            ) : (
              <p className="text-gray-500">Drag & drop a PDF file here, or click to select.</p>
            )}
          </div>
        </div>

        {/* User Document Dropzone */}
        <div>
          <label className="block text-lg font-semibold mb-2 text-gray-700">
            User Document
          </label>
          <div
            {...getUserRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
              isUserActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
          >
            <input {...getUserInputProps()} />
            {userFile ? (
              <p className="text-green-700 font-medium">{userFile.name}</p>
            ) : (
              <p className="text-gray-500">Drag & drop a PDF file here, or click to select.</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition duration-200"
        >
          Compare Documents
        </button>
      </form>
    </div>
  );
};

export default DocumentInput;
