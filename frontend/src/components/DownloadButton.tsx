const DownloadButton = () => {
    const handleDownload = () => {
      const blob = new Blob(["This is a sample response file."], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "response.txt");
      document.body.appendChild(link);
      link.click();
      link.remove();
    };
  
    return (
      <button
        onClick={handleDownload}
        className="bg-green-600 text-white px-4 py-2 rounded mb-6"
      >
        ⬇️ Download Response
      </button>
    );
  };
  
  export default DownloadButton;
  