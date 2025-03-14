import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Video, MessageCircle, User, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const navItems = [
    { path: "/", icon: Home, label: "Home", color: "text-blue-400" },
    {
      path: "/explore",
      icon: Video,
      label: "Explore",
      color: "text-green-400",
    },
    {
      path: "/messages",
      icon: MessageCircle,
      label: "Messages",
      color: "text-purple-400",
    },
    { path: "/profile", icon: User, label: "Profile", color: "text-pink-400" },
  ];

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 border-t border-gray-200 shadow-md transition-all duration-300",
        isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
      )}
    >
      <div className="max-w-screen-xl mx-auto flex justify-between items-center py-3 px-4">
        <ul className="flex justify-around items-center flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center p-2 rounded-xl transition-all duration-300",
                    isDarkMode ? "text-gray-300" : "text-gray-800",
                    isActive
                      ? "scale-110 font-bold"
                      : "opacity-80 hover:opacity-100"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-7 h-7 transition-transform",
                      isActive ? "scale-125" : "opacity-90",
                      item.color
                    )}
                  />
                  <span className="text-xs mt-1 font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Dark Mode Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full transition-all duration-300 text-gray-800 dark:text-white bg-gray-300 hover:bg-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6 text-yellow-400" />
          ) : (
            <Moon className="w-6 h-6 text-gray-500" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
