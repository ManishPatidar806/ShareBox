"use client"
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Simulate logout process (replace with your actual logout logic)
    const handleLogout = async () => {
      // Clear authentication token or session
      localStorage.removeItem("token");
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      // Redirect to login page
      router.push("/login");
    };

    handleLogout(); // Call the logout function when the component mounts
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Logging Out...
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            You are now being logged out. Please wait a moment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
