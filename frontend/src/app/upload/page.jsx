"use client";
import React, { useState, useCallback, useRef } from "react";
import { Upload, Calendar, Key, Lock, X, File } from "lucide-react";
import MainLayout from "../../components/MainLayout";
import API from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../Loading/Loading";

const UploadPage = () => {
  const [uploadData, setUploadData] = useState({
    files: [],
    password: "",
    expiryDate: "",
    oneTimeAccess: false,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    const newFiles = Array.from(files);
    if (newFiles.length > 0) {
      setUploadData((prev) => ({
        ...prev,
        files: [newFiles[0]],
      }));
    }
  };

  const removeFile = (fileToRemove) => {
    setUploadData((prev) => ({
      ...prev,
      files: prev.files.filter((file) => file !== fileToRemove),
    }));
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUploadData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileInput = (e) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      if (uploadData.files.length === 0) {
        throw new Error("No file selected.");
      }

      const formData = new FormData();
      formData.append("file", uploadData.files[0]);
      formData.append("password", uploadData.password);
      formData.append("expiryDate", uploadData.expiryDate);
      formData.append("oneTimeAccess", uploadData.oneTimeAccess);

      const response = await API.post("/api/uploadFiles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 202) {
        throw new Error("Upload failed.");
      }

      toast.success("Upload successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setUploadData({
        files: [],
        password: "",
        expiryDate: "",
        oneTimeAccess: false,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error(`Upload failed: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };
  if (isUploading) {
    return <Loading />;
  }
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <ToastContainer />
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors group ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-500"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
        >
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
            <Upload className="w-8 h-8  group-hover:text-blue-700 text-gray-900" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900">
            {uploadData.files.length > 0
              ? `${uploadData.files.length} file(s) selected`
              : "Drag & Drop Files Here"}
          </h3>
          <p className="mb-4 text-gray-900">or</p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            id="fileInput"
            onChange={handleFileInput}
            aria-label="File upload input"
          />
          <label
            htmlFor="fileInput"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium
              hover:bg-blue-700 transition-colors cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              inline-block"
          >
            Choose Files
          </label>
        </div>

        {uploadData.files.length > 0 && (
          <div className="border border-gray-200 rounded-lg p-4 text-gray-900">
            <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
              <File className="w-5 h-5 text-blue-600" />
              Selected Files
            </h4>
            <ul className="space-y-2">
              {uploadData.files.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded"
                >
                  <span className="truncate max-w-[70%]">{file.name}</span>
                  <button
                    onClick={() => removeFile(file)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label={`Remove file ${file.name}`}
                  >
                    <X className="w-5 h-5 text-gray-900" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-900">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-5 h-5 text-blue-600" />
              <label htmlFor="password" className="font-medium">
                Password Protection
              </label>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              value={uploadData.password}
              onChange={handleInputChange}
              placeholder="Set password"
              className="w-full px-4 py-2 rounded border border-gray-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              aria-describedby="password-hint"
            />
            <p id="password-hint" className="text-xs mt-1 text-gray-900">
              Optional: Protect your files with a password
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <label htmlFor="expiryDate" className="font-medium">
                Expiry Date
              </label>
            </div>
            <input
              id="expiryDate"
              type="date"
              name="expiryDate"
              value={uploadData.expiryDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded border border-gray-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              aria-describedby="expiry-hint"
            />
            <p id="expiry-hint" className="text-xs mt-1 text-gray-900">
              Optional: Set an expiration date for your files
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Key className="w-5 h-5 text-blue-600" />
              <span className="font-medium">One-time Access</span>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="oneTimeAccess"
                checked={uploadData.oneTimeAccess}
                onChange={handleInputChange}
                className="w-4 h-4 
                  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-gray-900"
                id="oneTimeAccess"
              />
              <label htmlFor="oneTimeAccess" className=" text-gray-900">
                Enable one-time file access
              </label>
            </label>
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={isUploading || uploadData.files.length === 0}
          className={`w-full py-3 bg-blue-600 text-white rounded-lg font-medium
            transition-colors flex items-center justify-center gap-2
            ${
              isUploading || uploadData.files.length === 0
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
        >
          {isUploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            "Encrypt & Upload"
          )}
        </button>
      </div>
    </MainLayout>
  );
};

export default UploadPage;
