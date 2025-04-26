import React, { useState, useEffect } from 'react';
import { Files, Upload, Activity } from 'lucide-react';

const StatsCard = () => {
  const [stats, setStats] = useState([
    {
      id: 1,
      title: "Total Encrypted Files",
      value: 0,
      icon: Files,
      trend: { value: 0, isPositive: true }
    },
    {
      id: 2,
      title: "Active Shared Links",
      value: 0,
      icon: Upload,
      trend: { value: 0, isPositive: true }
    },
    {
      id: 3,
      title: "Recent Downloads",
      value: 0,
      icon: Activity,
      trend: { value: 0, isPositive: true }
    }
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simulate API call with mock data
        const mockData = stats.map(stat => ({
          ...stat,
          value: Math.floor(Math.random() * 1000),
          trend: {
            value: Math.floor(Math.random() * 20),
            isPositive: Math.random() > 0.5
          }
        }));
        setStats(mockData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map(({ id, title, value, icon: Icon, trend }) => (
        <div key={id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <p className="text-2xl font-semibold mt-1 text-gray-900">{value}</p>
              {trend && (
                <p
                  className={`text-sm mt-2 flex items-center gap-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                  <span>{trend.isPositive ? '↑' : '↓'}</span>
                  <span className="text-gray-900">{Math.abs(trend.value)}%</span>
                </p>
              )}
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;
