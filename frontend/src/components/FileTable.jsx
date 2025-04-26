import React, { useState, useEffect } from 'react';
import { Download, Share2, Trash2, Lock, Search, KeyRound } from 'lucide-react';
import ShareModal from './ShareModel';
import API from '../utils/api';
import Link from 'next/link';


const FileTable = ({ files, setFiles }) => {
  // const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sharedFiles, setSharedFiles] = useState({});
  const [selectedFileToShare, setSelectedFileToShare] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedFileToDownload, setSelectedFileToDownload] = useState(null);
  const [downloadPassword, setDownloadPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Notification Management
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleShare = (file) => {
    setSharedFiles(prev => ({
      ...prev,
      [file.id]: new Date().toISOString()
    }));
    showNotification(`${file.fileName} shared successfully`);
  };

  // Notification Component
  const Notification = ({ message, type }) => {
    const baseClasses = "fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-all";
    const typeClasses = {
      success: "bg-green-500 text-white",
      error: "bg-red-500 text-white",
      warning: "bg-yellow-500 text-black"
    };

    return (
      <div className={`${baseClasses} ${typeClasses[type]}`}>
        {message}
      </div>
    );
  };

  // File filtering logic
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || file.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDownload = async (file) => {
    if (!file.password) {
      await initiateDownload(file);  // Start download if not password protected.
      return;
    }

    setSelectedFileToDownload(file); //open dialog
  };

  const initiateDownload = async (file) => {
    try {
      const response = await API.post(
        `/api/downloadFile/${file.id}`,
        {
          password: downloadPassword,
        }, // Pass any required request body if needed
        {
          responseType: "blob", // This ensures the response is treated as a file
        }
      );

      if (response.status !== 200) {
        console.error("Failed to download file:", response.statusText);
        showNotification('Failed to download file. Please try again.', 'error');
        return;
      }

      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = file.fileName || "downloaded_file"; // Default file name if not provided

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      showNotification('Failed to download file. Please try again.', 'error');
    }
    showNotification(`${file.fileName} downloaded successfully`);
    setSelectedFileToDownload(null); //close dialog
    setDownloadPassword('');
  }

  const verifyPasswordAndDownload = async () => {
    if (!selectedFileToDownload) return;

    setIsVerifying(true);
    initiateDownload(selectedFileToDownload);
    // Simulate backend verification with a delay
    setIsVerifying(false);
  };

  const handleDelete = async (file) => {
    if (window.confirm(`Are you sure you want to delete "${file.fileName}"?`)) {
      try {
        const response = await API.get(`/api/deleteFiles?id=${file.id}`);
        if (response.status !== 200) {
          throw new Error(`Failed to delete file: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error deleting file:', error);
        showNotification('Failed to delete file. Please try again');
        return;
      }
      setFiles(currentFiles => currentFiles.filter(f => f.id !== file.id));
      showNotification(`${file.fileName} deleted successfully`, 'warning');
    }
  }

  return (
    <>
      {/* Share Modal */}
      {selectedFileToShare && (
        <ShareModal
          file={selectedFileToShare}
          onClose={() => setSelectedFileToShare(null)}
          onShare={handleShare}
        />
      )}

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
        />
      )}

      {/* Download Password Dialog */}
      {selectedFileToDownload && (
        <div className="fixed inset-0 bg-[#00000033] bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Download {selectedFileToDownload?.name}</h2>
              <p className="text-gray-600 mt-2">
                {selectedFileToDownload?.password
                  ? "This file is password protected. Enter the password to download."
                  : "Do you want to download this file?"}
              </p>
            </div>
            {selectedFileToDownload?.password && (
              <div className="p-6 space-y-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={downloadPassword}
                  onChange={(e) => setDownloadPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isVerifying}
                />
              </div>
            )}
            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                type="button"
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={() => {
                  setSelectedFileToDownload(null);
                  setDownloadPassword('');
                }}
                disabled={isVerifying}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={verifyPasswordAndDownload}
                disabled={isVerifying || (selectedFileToDownload?.password && !downloadPassword)}
              >
                {isVerifying ? (
                  <><KeyRound className="mr-2 h-4 w-4 animate-spin" />Verifying...</>
                ) : (
                  "Download"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg mt-4">
        {/* Search and filter section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-5 h-5" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {/* File table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">File Name</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Size</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Upload Date</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Expiry Date</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Status</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No files found
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => (
                  <tr key={file.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-blue-600" />
                        <Link href={"/file/" + file.id} className="font-medium text-gray-800">{file.fileName}</Link>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{file.fileSize}</td>
                    <td className="py-4 px-6 text-gray-600">{file.createdDate}</td>
                    <td className="py-4 px-6 text-gray-600">{file.expiryDate || "---"}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${file.shared === false
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}>
                        {file.shared === true ? 'Shared' : 'Not Shared'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDownload(file)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedFileToShare(file)}
                          className={`p-2 rounded-lg transition-colors ${sharedFiles[file.id]
                            ? 'bg-blue-100 text-blue-700'
                            : 'hover:bg-gray-100 text-gray-600'
                            }`}
                          title={sharedFiles[file.id] ? 'Shared' : 'Share'}
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { handleDelete(file) }}
                          className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default FileTable;

