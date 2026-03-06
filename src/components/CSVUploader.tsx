import api from "@/services/APIRequest";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

const expectedFields = ["name", "dob", "gender", "address", "first_release_year", "no_of_albums_released"];

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  uploadUrl: string; 
}

const CSVImportModal: React.FC<CSVImportModalProps> = ({ isOpen, onClose, uploadUrl }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropZoneText, setDropZoneText] = useState("Drag & drop a CSV file here, or click to select a file");

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    accept: { "text/csv": [".csv"] },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        setDropZoneText(file.name);

        const errors = await validateCSV(file);
        if (errors.length > 0) {
          setValidationErrors(errors);
          setSelectedFile(null);
        } else {
          setValidationErrors([]);
        }
      }
    },
    onDropRejected: () => {
      setValidationErrors(["Please upload a valid CSV file (Max 5MB)"]);
    },
  });


  const validateCSV = async (file: File) => {
    const text = await file.text();
    const rows = text.split("\n").map(r => r.trim());
    const errors: string[] = [];

    if (!rows[0]) {
      errors.push("CSV file is empty or missing headers.");
      return errors;
    }

    const headers = rows[0].split(",");
    if (!headers.every((header, index) => header.trim() === expectedFields[index])) {
      errors.push("Invalid headers. Expected: " + expectedFields.join(", "));
    }

    rows.forEach((row, i) => {
      if (i === 0 || row === "") return; 
      const cols = row.split(",");
      if (cols.length !== expectedFields.length) {
        errors.push(`Row ${i + 1}: Invalid number of columns.`);
        return;
      }

      const [name, dob, gender, address, first_release_year, no_of_albums_released] = cols;
      if (!name) errors.push(`Row ${i + 1}: Name is required.`);
      if (!address) errors.push(`Row ${i + 1}: Address is required.`);
      if (!isValidDate(dob)) errors.push(`Row ${i + 1}: Invalid Date of Birth.`);
    //   if (!["m", "f", "O"].includes(gender)) errors.push(`Row ${i + 1}: Gender must be m, f, or o.`);
      if (!/^\d{4}$/.test(first_release_year)) errors.push(`Row ${i + 1}: Year must be 4 digits.`);
      if (!/^\d+$/.test(no_of_albums_released)) errors.push(`Row ${i + 1}: Number of albums must be a positive integer.`);
    });

    return errors;
  };

  const isValidDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return !isNaN(d.getTime());
  };

  
  const handleUpload = async () => {
    if (!selectedFile) {
      setValidationErrors(["Please select a CSV file to upload."]);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await api.post(uploadUrl , formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
   
      setLoading(false);

      if (!response.data || (response.data.errors)) {
        setValidationErrors(response.data.errors ||response.data.message || ["Upload failed due to server error."]);
      } else {
        toast.success("CSV uploaded successfully!");
        onClose();
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      setValidationErrors(["Upload failed due to network or server error."]);
    }
  };

  
  const downloadSampleCSV = async () => {
    try {
      const response = await fetch("/sample-artist-import.csv");
      if (!response.ok) throw new Error("Failed to fetch sample CSV");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sample-artist-import.csv");
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error("Error downloading sample CSV.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold mb-4">Import Artists via CSV</h2>
          <button className="text-gray-400 hover:text-gray-600" onClick={onClose}>✕</button>
        </div>

        <div {...getRootProps()} className={`border-dashed border-2 p-4 h-20 flex text-center ${isDragActive ? "border-blue-400" : "border-gray-300"}`}>
          <input {...getInputProps()} />
          <p className="m-auto">{dropZoneText}</p>
        </div>

        {fileRejections.length > 0 && <p className="mt-2 text-red-500">File is too large or not a CSV</p>}

        {validationErrors.length > 0 && (
          <div className="mt-4">
            <p className="text-red-500 font-semibold">Errors:</p>
            <ul className="list-disc list-inside text-red-500">
              {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={downloadSampleCSV}>
            Download Sample
          </button>
          <button
            className={`px-4 py-2 ${loading ? "bg-gray-400" : "bg-green-500"} text-white rounded-lg hover:bg-green-600`}
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload CSV"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CSVImportModal;