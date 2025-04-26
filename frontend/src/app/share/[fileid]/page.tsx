"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  DownloadCloud,
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  FileIcon,
  Calendar,
  FileText,
  Lock,
} from "lucide-react";
import API from "../../../utils/api";
import { useParams } from "next/navigation";

const FileDownloadPage = () => {
  const {fileid} = useParams();
  const [fileData, setFileData] = useState(null);
  const [password, setPassword] = useState("");
  const [fileUrl, setFileUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Get file type icon and name
  const getFileTypeDetails = (fileType) => {
    const typeMap = {
      "image/png": { icon: FileIcon, label: "PNG Image" },
      "image/jpeg": { icon: FileIcon, label: "JPEG Image" },
      "application/pdf": { icon: FileText, label: "PDF Document" },
      default: { icon: FileIcon, label: "Unknown File" },
    };
    return typeMap[fileType] || typeMap["default"];
  };

  // Fetch file details
  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const response = await API.get(`/api/getFiles?id=${fileid}`);
        setFileData(response.data);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch file details");
        setIsLoading(false);
      }
    };

    fetchFileDetails();
  }, []);

  const handleDownload = useCallback(() => {
    if (!password) {
      setError("Please enter the password.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulating password verification
    setTimeout(() => {
      if (password === fileData.password) {
        setFileUrl("https://example.com/download-file");
        setIsLoading(false);
      } else {
        setError("Invalid password. Please try again.");
        setIsLoading(false);
      }
    }, 1000);
  }, [password, fileData]);

  const initiateDownload = async (file) => {
    try {
      const response = await API.post(
        `/api/downloadFile/${file.id}`,
        {
          password: password,
        }, // Pass any required request body if needed
        {
          responseType: "blob", // This ensures the response is treated as a file
        }
      );

      if (response.status !== 200) {
        console.error("Failed to download file:", response.statusText);
        return;
      }

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = file.fileName || "downloaded_file"; // Default file name if not provided

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <AlertTriangle className="mx-auto w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Render file details
  if (!fileData) return null;

  const FileTypeIcon = getFileTypeDetails(fileData.fileType).icon;
  const fileTypeLabel = getFileTypeDetails(fileData.fileType).label;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-blue-50 px-6 py-4 border-b border-gray-200 flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Secure File Download
            </h2>
          </div>

          {/* File Details */}
          <div className="p-6 border-b border-gray-200 flex items-center space-x-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <FileTypeIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {fileData.fileName}
              </h3>
              <div className="text-sm text-gray-600 flex items-center space-x-2">
                <span>{fileTypeLabel}</span>
                <span>•</span>
                <span>{formatFileSize(fileData.fileSize)}</span>
              </div>
            </div>
          </div>

          {/* File Access Details */}
          <div className="px-6 py-4 bg-gray-50 grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-600">Created</p>
                <p className="text-sm font-medium">{fileData.createdDate}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-600">Expires</p>
                <p className="text-sm font-medium">{fileData.expiryDate}</p>
              </div>
            </div>
          </div>

          {/* Password Protection Section */}
          <div className="p-6 space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-2 flex items-center justify-center">
                <Lock className="mr-2 w-5 h-5 text-gray-500" />
                This file is password-protected
              </p>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && initiateDownload(fileData)
                  }
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-describedby="password-input-help"
                  aria-invalid={!!error}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <KeyRound className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {error && (
                <div
                  className="flex items-center text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg text-sm"
                  role="alert"
                >
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  {error}
                </div>
              )}
            </div>

            {/* Download Button */}
            <button
              onClick={() => initiateDownload(fileData)}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <DownloadCloud className="mr-2 h-5 w-5" />
                  Download File
                </>
              )}
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-4 text-sm text-gray-500">
          <p>One-time access: {fileData.oneTimeAccess ? "Yes" : "No"}</p>
        </div>
      </div>
    </div>
  );
};

export default FileDownloadPage;
