"use client";
import React, { useEffect, useState } from "react";
import { LinkIcon, Lock, X } from "lucide-react";
import API from "../utils/api";


const ShareModal = ({ file, onClose, onShare }) => {
  const [shareMethod, setShareMethod] = useState("link");
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");

  const handleShare = async () => {
    if (shareMethod === "link") {
      navigator.clipboard.writeText(domain + `/share/${file.id}`).then(() => {
        onShare(file);
        onClose();
      });
    } else if (shareMethod === "email" && email) {
      try {
        const response = await API.post(`/api/shareFiles?id=${file.id}&link=${domain + `/share/${file.id}`}&email=${email}`);
        if (response.status !== 200) {
          throw new Error("Failed to share file");
        }
      } catch (error) {
        console.error("Failed to send email:", error);
      }
      console.log(`Sharing ${file.name} with ${email}`);
      onShare(file);
      onClose();
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDomain(window.location.origin);
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-[#00000033] bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Share File</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* File Details */}
          <div className="flex items-center mb-6 bg-gray-50 p-4 rounded-lg">
            <Lock className="w-6 h-6 text-blue-600 mr-4" />
            <div>
              <p className="font-medium text-gray-800">{file.fileName}</p>
              <p className="text-sm text-gray-600">
                {file.fileSize} • Uploaded on {file.createdDate}
              </p>
            </div>
          </div>

          {/* Share Method Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share Method
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="link"
                  checked={shareMethod === "link"}
                  onChange={() => setShareMethod("link")}
                  className="mr-2"
                />
                <span className="text-gray-900">Copy Link</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="email"
                  checked={shareMethod === "email"}
                  onChange={() => setShareMethod("email")}
                  className="mr-2"
                />
                <span className="text-gray-900">Email</span>
              </label>
            </div>
          </div>

          {/* Share Content */}
          {shareMethod === "link" ? (
            <div className="bg-gray-100 rounded-lg p-3 flex items-center">
              <LinkIcon className="w-5 h-5 mr-3 text-gray-600" />
              <input
                type="text"
                value={domain + `/share/${file.id}`}
                readOnly
                className="flex-1 bg-transparent outline-none text-gray-900"
              />
              <button
                onClick={() => navigator.clipboard.writeText(domain + `/share/${file.id}`)}
                className="ml-2 bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
              >
                Copy
              </button>
            </div>
          ) : (
            <div>
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            disabled={shareMethod === "email" && !email}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
