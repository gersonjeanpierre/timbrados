
const FileUploadButton = ({ title, description, onChange }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="text-lg font-bold">{title}</div>
      <div className="text-sm text-gray-600">{description}</div>
      <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg">
        Seleccionar archivo
      </label>
      <input
        type="file"
        id="file-upload"
        accept=".csv"
        className="hidden"
        onChange={onChange}
      />
    </div>
  );
};

export default FileUploadButton;
