import { useState } from "react";
import axios from "axios";

type DownloadButtonProps = {
  comparisonId: string;
};

const DownloadButton: React.FC<DownloadButtonProps> = ({ comparisonId }) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleDownload = async (format: "pdf" | "excel",comparisonId: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/document/download?format=${format}&comparisonId=${comparisonId}`,
        { responseType: "blob" }
      );

      const fileName = format === "pdf" ? "report.pdf" : "report.xlsx";

      const blob = new Blob([response.data], {
        type:
          format === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setShowOptions(false);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Something went wrong while downloading the report.");
    }
  };

  return (
    <div className="relative mb-6">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        ⬇️ Download Report
      </button>

      {showOptions && (
        <div className="absolute mt-2 bg-white text-black shadow-lg rounded z-20">
          <button
            onClick={() => handleDownload("pdf",comparisonId)}
            className="block w-full px-4 py-2 hover:bg-gray-200 text-left"
          >
            📄 PDF
          </button>
          <button
            onClick={() => handleDownload("excel",comparisonId)}
            className="block w-full px-4 py-2 hover:bg-gray-200 text-left"
          >
            📊 Excel
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadButton;
