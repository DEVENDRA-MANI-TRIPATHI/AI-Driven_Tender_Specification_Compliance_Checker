import { useState } from "react";

const UploadSection = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!file1 || !file2) {
      alert("Please upload both documents");
      return;
    }

    // Simulate successful upload
    alert("✅ Files uploaded successfully (simulated)");
  };

  return (
    <div className="bg-gray-800 p-4 rounded shadow mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
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
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default UploadSection;
