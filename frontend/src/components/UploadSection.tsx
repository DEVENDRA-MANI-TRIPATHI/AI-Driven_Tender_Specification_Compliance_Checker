import { useState } from "react";
import axios from "axios";

interface UploadSectionProps {
  onCompare: (result: any, comparisonId: string) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onCompare }) => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file1 || !file2) {
      alert("Please upload both documents");
      return;
    }

    const formData = new FormData();
    formData.append("referenceFile", file1);
    formData.append("userFile", file2);

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/document/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("✅ Response from server:", res.data);
      const { comparisonResult, comparisonId } = res.data;
      console.log(comparisonId)
      onCompare(comparisonResult, comparisonId);
    } catch (error: any) {
      console.error("Upload error:", error.message);
      alert("Failed to upload and compare documents.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded shadow mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <input
          type="file"
          onChange={(e) => setFile1(e.target.files?.[0] || null)}
          className="text-white"
        />
        <input
          type="file"
          onChange={(e) => setFile2(e.target.files?.[0] || null)}
          className="text-white"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default UploadSection;
