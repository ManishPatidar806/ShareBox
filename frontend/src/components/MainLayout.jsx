"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Files,
  Upload,
  Activity,
  Settings,
  LogOut,
  X,
  ChevronRight,
  ChevronLeft,
  AlignLeft,
  Box,
  Wrench,
} from "lucide-react";
import Link from "next/link";

const MainLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMiniSidebar, setIsMiniSidebar] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navItems = [
    { icon: <Files />, label: "My Files", href: "/" },
    { icon: <Upload />, label: "Upload", href: "/upload" },
    { icon: <Activity />, label: "Activity Logs", href: "/activity" },
    { icon: <Wrench />, label: "Tool", href: "/tool" },
    { icon: <Settings />, label: "Settings", href: "/settings" },
  ];

  // Check screen size and update mobile state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    // Cleanup listener
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Save sidebar state to localStorage
  useEffect(() => {
    if (isMiniSidebar !== null) {
      localStorage.setItem('isMiniSidebar', String(isMiniSidebar));
    } else {
      const storedValue = localStorage.getItem('isMiniSidebar');
      setIsMiniSidebar(storedValue === 'true');
    }
  }, [isMiniSidebar]);

  const handleLogout = () => {
    router.push("/logout");
  };

  const toggleDesktopSidebar = () => {
    setIsMiniSidebar(!isMiniSidebar);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[#00000033] bg-opacity-50 z-30 md:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden fixed top-4 left-4 z-20 p-2 bg-white rounded-full shadow-md text-blue-800 hover:bg-gray-100 transition-colors"
        aria-label="Toggle sidebar"
      >
        <AlignLeft size={20} />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative z-40 h-full bg-white text-gray-800 shadow-lg transition-all duration-300 ease-in-out
          ${isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
          }
          ${isMiniSidebar ? "md:max-w-16" : "md:w-64"}
          w-64
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle Area */}
          <div className="flex items-center p-3 justify-between border-b border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-50 p-1 rounded-full">
                <Box className="h-7 w-7 text-primary relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
              </div>
              <h1
                className={`ml-3 text-xl font-bold ${isMiniSidebar ? "md:hidden" : ""
                  }`}
              >
                ShareBox
              </h1>
            </div>

            {/* Desktop Toggle Button */}
            <button
              onClick={toggleDesktopSidebar}
              className="hidden absolute z-50 top-0 -right-3 md:flex text-gray-800 bg-gray-100 p-2 rounded-full hover:bg-gray-200"
              aria-label={isMiniSidebar ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isMiniSidebar ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={toggleMobileSidebar}
              className="md:hidden text-gray-800 hover:bg-gray-100 p-2 rounded-full"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 mt-1 overflow-y-auto">
            <ul className="px-2 space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${pathname === item.href ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-700"} `}
                  >
                    {React.cloneElement(item.icon, { className: "flex-shrink-0" })}
                    <span className={`${isMiniSidebar ? "ml-3 md:hidden" : "ml-3"}`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Actions */}
          <div className="border-t border-gray-200 p-2 space-y-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-100"
            >
              <LogOut size={20} className="flex-shrink-0" />
              <span className={`${isMiniSidebar ? "ml-3 md:hidden" : "ml-3"}`}>
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;

