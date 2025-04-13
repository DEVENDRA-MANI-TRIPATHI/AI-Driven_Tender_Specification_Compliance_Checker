import { useState } from "react";
import UploadSection from "../components/UploadSection";
import DownloadButton from "../components/DownloadButton";
import ResponseTable from "../components/ResponseTable";

export const Dashboard = () => {
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [comparisonId, setComparisonId] = useState("");

  const handleCompare = (result: any,id:string) => {
    setComparisonResult(result);
    setComparisonId(id);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📄 Document Comparison Dashboard</h1>
      <UploadSection onCompare={handleCompare} />
      <DownloadButton />
      {comparisonResult?.comparison && (
        <ResponseTable data={comparisonResult.comparison} comparisonId={comparisonId} />
      )}
    </div>
  );
};
