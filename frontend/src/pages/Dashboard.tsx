import UploadSection from "../components/UploadSection";
import DownloadButton from "../components/DownloadButton";
import ResponseTable from "../components/ResponseTable";

export const Dashboard = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📄 Document Comparison Dashboard</h1>
      <UploadSection />
      <DownloadButton />
      <ResponseTable />
    </div>
  );
};
