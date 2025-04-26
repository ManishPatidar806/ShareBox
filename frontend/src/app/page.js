"use client"
import React, { useEffect, useState } from 'react';
import FileTable from '../components/FileTable';
import MainLayout from '../components/MainLayout';
import API from '../utils/api';
import Loading from './Loading/Loading';
import { Files, Upload, Activity } from 'lucide-react';

function Dashboard() {
  const [activeSharedLinks, setActiveSharedLinks] = useState(0);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const response = await API.get("/api/getAllFiles");
        if (response.status !== 200) {
          throw new Error(`Failed to fetch files: ${response.statusText}`);
        }
        setFiles(response.data.filesList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching files:', error);
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  useEffect(() => {
    setActiveSharedLinks(files.filter(file => file.shared).length);
  }, [files]);

  if (loading) {
    return <Loading />;
  }

  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Encrypted Files */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Encrypted Files</p>
              <p className="text-2xl font-semibold mt-1 text-gray-900">{files.length}</p>
              <p className="text-sm mt-2 flex items-center gap-1 text-green-600">
                <span>↑</span>
                <span className="text-gray-900">12%</span>
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Files className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Active Shared Links */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Shared Links</p>
              <p className="text-2xl font-semibold mt-1 text-gray-900">{activeSharedLinks}</p>
              <p className="text-sm mt-2 flex items-center gap-1 text-red-600">
                <span>↓</span>
                <span className="text-gray-900">8%</span>
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Recent Downloads */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Recent Downloads</p>
              <p className="text-2xl font-semibold mt-1 text-gray-900">125</p>
              <p className="text-sm mt-2 flex items-center gap-1 text-green-600">
                <span>↑</span>
                <span className="text-gray-900">5%</span>
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

      </div>
      <FileTable files={files} setFiles={setFiles} />
    </MainLayout>
  );
}

export default Dashboard;
