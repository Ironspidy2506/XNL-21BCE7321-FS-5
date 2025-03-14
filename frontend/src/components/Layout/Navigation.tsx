
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Video, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/explore", icon: Video, label: "Explore" },
    { path: "/messages", icon: MessageCircle, label: "Messages" },
    { path: "/profile", icon: User, label: "Profile" }
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-border z-50 animate-slide-up">
      <div className="max-w-screen-xl mx-auto">
        <ul className="flex justify-around items-center py-3 px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center p-2 rounded-xl transition-all duration-300",
                    isActive 
                      ? "text-primary scale-110" 
                      : "text-muted-foreground hover:text-primary/80"
                  )}
                >
                  <item.icon className={cn("w-6 h-6", isActive ? "animate-scale-in" : "")} />
                  <span className="text-xs mt-1 font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
