"use client";
import React, { useState, useEffect } from "react";
import {
  Download,
  Upload,
  Share2,
  Search,
  Filter,
  ArrowDownToLine,
  Clock,
  MoreVertical,
} from "lucide-react";
import MainLayout from "../../components/MainLayout";
import API from "../../utils/api";
import Loading from "../Loading/Loading";

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Simulated data fetch
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const response = await API.get("/api/activity");
        if (response.status !== 200) {
          throw new Error(`Failed to fetch activities: ${response.statusText}`);
        }

        setActivities(response.data.activities.content);
        setSuccessMessage("Activities loaded successfully!");
      } catch (error) {
        console.error("Error fetching activities:", error);
        setError("Failed to load activities. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Get icon based on status
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "download":
        return <ArrowDownToLine className="w-5 h-5 text-blue-600" />;
      case "upload":
        return <Upload className="w-5 h-5 text-green-600" />;
      case "share":
        return <Share2 className="w-5 h-5 text-purple-600" />;
      default:
        return null;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "download":
        return "bg-blue-50 text-blue-600";
      case "upload":
        return "bg-green-50 text-green-600";
      case "share":
        return "bg-purple-50 text-purple-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  // Filter activities
  const filteredActivities = activities.filter(
    (activity) =>
      activity.fileName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === "all" ||
        activity.status.toLowerCase() === filterStatus.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <MainLayout>
        <Loading />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Notification Bar */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
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

      <div className="bg-white rounded-xl border border-gray-200 shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Activity Logs</h2>
            <div className="flex items-center space-x-2">
              <button className="hover:bg-gray-100 p-2 rounded-full">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Activities</option>
              <option value="upload">Uploads</option>
              <option value="download">Downloads</option>
              <option value="share">Shares</option>
            </select>
          </div>
        </div>

        {/* Activities List */}
        <div className="divide-y divide-gray-100">
          {filteredActivities.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No activities found
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center space-x-4">
                  {/* Status Icon */}
                  <div
                    className={`p-2.5 rounded-full ${getStatusColor(
                      activity.status
                    )}`}
                  >
                    {getStatusIcon(activity.status)}
                  </div>

                  {/* Activity Details */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-gray-800">
                        {activity.fileName}
                      </p>
                      <span
                        className={`
                          px-2 py-0.5 rounded-full text-xs font-medium
                          ${getStatusColor(activity.status)}
                        `}
                      >
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center space-x-2">
                      <Clock className="w-4 h-4 mr-1 inline-block" />
                      {activity.createdDate
                        ? new Date(activity.createdDate).toLocaleString()
                        : "No date"}
                    </p>
                  </div>
                </div>

                {/* More Options */}
                <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredActivities.length > 0 && (
          <div className="p-4 border-t border-gray-200 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Showing {filteredActivities.length} of {activities.length}{" "}
              activities
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
export default ActivityLog;
