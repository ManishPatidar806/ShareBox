"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  File,
  Lock,
  Share2,
  Trash2,
  Edit,
  Save,
  X,
  Info,
  Calendar,
  FileText,
  Shield,
  Copy,
} from "lucide-react";
import { useParams } from "next/navigation";
import MainLayout from "../../../components/MainLayout";
import API from "../../../utils/api";

const FileDetailsPage = () => {
  const { fileid } = useParams();
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit mode states
  const [editMode, setEditMode] = useState({
    fileName: false,
    expiryDate: false,
    oneTimeAccess: false,
  });

  // Temporary edit values
  const [editValues, setEditValues] = useState({
    fileName: "",
    expiryDate: "",
    oneTimeAccess: false,
  });

  // Fetch file details on component mount
  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const response = await API.get(`/api/getFiles?id=${fileid}`);
        const fileData = response.data;

        setFile(fileData);
        setEditValues({
          fileName: fileData.fileName,
          expiryDate: fileData.expiryDate || "",
          oneTimeAccess: fileData.oneTimeAccess,
        });
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch file details");
        setIsLoading(false);
      }
    };

    fetchFileDetails();
  }, [fileid]);

  // Utility function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Toggle edit mode for a specific field
  const toggleEditMode = (field) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handle input changes in edit mode
  const handleInputChange = (field, value) => {
    setEditValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save changes for a specific field
  const saveChanges = async (field) => {
    try {
      // In a real app, you'd make an API call to update the field
      const updatedFile = {
        ...file,
        [field]: editValues[field],
      };

      // Simulated API call (replace with actual API endpoint)
      // const response = await axios.put(`/api/files/${file.id}`, updatedFile);

      setFile(updatedFile);
      toggleEditMode(field);
    } catch (err) {
      console.error("Failed to save changes", err);
    }
  };

  // Copy to clipboard function
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen text-red-600">
          {error}
        </div>
      </MainLayout>
    );
  }

  // Render file details
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">File Details</h2>
          </div>
        </div>

        {/* File Details Content */}
        <div className="p-6 space-y-6">
          {/* File Name */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <File className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-700">File Name</span>
            </div>
            {editMode.fileName ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={editValues?.fileName || ""}
                  onChange={(e) =>
                    handleInputChange("fileName", e.target.value)
                  }
                  className="border border-gray-300 rounded-md px-2 py-1"
                />
                <button
                  onClick={() => saveChanges("fileName")}
                  className="text-green-600 hover:bg-green-50 p-1 rounded"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button
                  onClick={() => toggleEditMode("fileName")}
                  className="text-red-600 hover:bg-red-50 p-1 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>{file.fileName}</span>
                <button
                  onClick={() => toggleEditMode("fileName")}
                  className="text-gray-500 hover:bg-gray-100 p-1 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* File Type & Size */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">File Type</span>
              <span className="font-medium">{file.fileType}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">File Size</span>
              <span className="font-medium">
                {formatFileSize(file.fileSize)}
              </span>
            </div>
          </div>

          {/* Encryption Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-gray-700">
                  Encryption Key
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(file.encryptKey)}
                className="text-gray-500 hover:bg-gray-100 p-1 rounded"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-white border border-gray-200 rounded p-2 text-sm text-gray-600 truncate">
              {file.encryptKey}
            </div>
          </div>

          {/* Access & Sharing Options */}
          <div className="space-y-4">
            {/* One-Time Access Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">One-Time Access</span>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={editValues.oneTimeAccess}
                  onChange={(e) =>
                    handleInputChange("oneTimeAccess", e.target.checked)
                  }
                  className="sr-only"
                />
                <div
                  className={`
                  w-10 h-5 rounded-full transition-colors duration-200
                  ${editValues.oneTimeAccess ? "bg-blue-600" : "bg-gray-300"}
                  relative
                `}
                >
                  <div
                    className={`
                    absolute left-0 top-0 bottom-0 m-auto 
                    w-4 h-4 rounded-full bg-white 
                    transition-transform duration-200
                    ${
                      editValues.oneTimeAccess
                        ? "translate-x-full"
                        : "translate-x-0"
                    }
                  `}
                  ></div>
                </div>
              </label>
            </div>

            {/* Expiry Date */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">Expiry Date</span>
              </div>
              {editMode.expiryDate ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={editValues.expiryDate}
                    onChange={(e) =>
                      handleInputChange("expiryDate", e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-2 py-1"
                  />
                  <button
                    onClick={() => saveChanges("expiryDate")}
                    className="text-green-600 hover:bg-green-50 p-1 rounded"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => toggleEditMode("expiryDate")}
                    className="text-red-600 hover:bg-red-50 p-1 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>{file.expiryDate || "No expiry date"}</span>
                  <button
                    onClick={() => toggleEditMode("expiryDate")}
                    className="text-gray-500 hover:bg-gray-100 p-1 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <button
              className="
                flex items-center justify-center 
                bg-blue-50 text-blue-600 
                py-3 rounded-lg 
                hover:bg-blue-100 
                transition-colors
              "
            >
              <Share2 className="mr-2 w-5 h-5" /> Share File
            </button>
            <button
              className="
                flex items-center justify-center 
                bg-red-50 text-red-600 
                py-3 rounded-lg 
                hover:bg-red-100 
                transition-colors
              "
            >
              <Trash2 className="mr-2 w-5 h-5" /> Delete File
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FileDetailsPage;
