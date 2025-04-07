import { useDropzone } from "react-dropzone";

type DropzoneUploaderProps = {
  file: File | null;
  onDrop: (file: File) => void;
  label: string;
};

const DropzoneUploader: React.FC<DropzoneUploaderProps> = ({ file, onDrop, label }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file?.type === "application/pdf") onDrop(file);
      else alert("Only PDF files are allowed.");
    },
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  return (
    <div className="mb-6">
      <label className="block mb-2 text-sm font-semibold text-gray-200">{label}</label>
      <div
        {...getRootProps()}
        className={`transition-all duration-300 flex items-center justify-center px-6 py-8 rounded-lg border-2 border-dashed
          ${isDragActive ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-400 bg-gray-800 text-gray-300'}
          hover:border-blue-400 hover:bg-gray-700 cursor-pointer`}
      >
        <input {...getInputProps()} />
        {file ? (
          <p className="text-sm font-medium">{file.name}</p>
        ) : (
          <p className="text-sm">Drag & drop your PDF here, or click to browse</p>
        )}
      </div>
    </div>
  );
};

export default DropzoneUploader;
