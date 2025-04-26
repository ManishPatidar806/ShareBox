"use client";
import React, { useState } from "react";
import { Key, Shield, Download } from "lucide-react";
import MainLayout from "../../components/MainLayout";
import API from "../../utils/api";
import Loading from "../Loading/Loading";

const Settings = () => {
  const [isTwoFactorAuthEnabled, setIsTwoFactorAuthEnabled] =
    React.useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // New state for success or error messages
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage(""); // Clear previous messages
    if (formData.confirmPassword !== formData.newPassword) {
      setError("Passwords must match");
      setLoading(false);
      return;
    }

    try {
      const response = await API.post(
        `/api/auth/changepassword`,
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        if (!response.data.status) {
          throw new Error(response.data?.message || "Password Change Failed");
        }

        setMessage("Password Changed Successfully");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const toggleTwoFactorAuth = async () => {
    setLoading(true);
    setMessage(""); // Clear previous messages
    setError(""); // Clear previous errors
    try {
      const response = await API.get("/api/auth/enableTwoStepVerification");

      if (response.status !== 200) {
        throw new Error("Failed to toggle two-factor auth");
      }
      if (response.data.message === "Two-step enabled.") {
        setIsTwoFactorAuthEnabled(true);
        setMessage("Two-Factor Authentication Enabled");
      } else {
        setIsTwoFactorAuthEnabled(false);
        setMessage("Two-Factor Authentication Disabled");
      }
    } catch (error) {
      setError("Failed to toggle two-factor auth");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {loading && <Loading />}
      {error && (
        <div className="flex items-center gap-3 mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
      {message && (
        <div className="flex items-center gap-3 mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{message}</span>
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Key className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Change Password
          </h2>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            placeholder="Current Password"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="New Password"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm New Password"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Two-Factor Authentication
          </h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className=" mb-2 text-gray-900">Enhance your account security</p>
            <p className="text-sm  text-gray-900">
              Use an authenticator app to get 2FA codes
            </p>
          </div>
          <button
            className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            onClick={toggleTwoFactorAuth}
          >
            {isTwoFactorAuthEnabled ? "Disable" : "Enable"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Download className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Encryption Keys
          </h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-2 text-gray-900">Manage your encryption keys</p>
            <p className="text-sm  text-gray-900">
              Download or regenerate your encryption keys
            </p>
          </div>
          <div className="space-x-4">
            <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              Download Keys
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Regenerate
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
