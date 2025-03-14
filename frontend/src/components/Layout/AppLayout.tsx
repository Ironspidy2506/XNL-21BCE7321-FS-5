
import React from "react";
import Navigation from "./Navigation";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const AppLayout = ({ children, className }: AppLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className={cn("flex-1", className)}>
        {children}
      </main>
      <Navigation />
    </div>
  );
};

export default AppLayout;
