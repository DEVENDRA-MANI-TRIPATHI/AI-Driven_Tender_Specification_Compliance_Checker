import { useState } from "react";
import axios from "axios";
import DropzoneUploader from "./DropzoneUploader";
import { extractTextFromPDF } from "../utils/extractPdfText";

type DocumentInputProps = {
  onCompare: (result: any) => void;
};

const DocumentInput: React.FC<DocumentInputProps> = ({ onCompare }) => {
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [userFile, setUserFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!referenceFile || !userFile) {
      alert("Please upload both reference and user PDF files.");
      return;
    }

    setLoading(true);

    try {
      const [refText, userText] = await Promise.all([
        extractTextFromPDF(referenceFile),
        extractTextFromPDF(userFile),
      ]);

      const response = await axios.post("http://localhost:8000/api/v1/document/compare", {
        referenceDoc: refText,
        userDoc: userText,
      });

      onCompare(response.data.result);
    } catch (error) {
      console.error("Error comparing documents:", error);
      alert("An error occurred while comparing the documents.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-gray-900 rounded-lg shadow-md">
      <DropzoneUploader
        label="📘 Reference PDF"
        file={referenceFile}
        onDrop={setReferenceFile}
      />
      <DropzoneUploader
        label="📄 User PDF"
        file={userFile}
        onDrop={setUserFile}
      />
      <button
        type="submit"
        disabled={loading}
        className={`w-full text-center py-3 rounded-md transition-all duration-300 font-semibold text-white ${
          loading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Processing..." : "🔍 Compare Documents"}
      </button>
    </form>
  );
};

export default DocumentInput;
