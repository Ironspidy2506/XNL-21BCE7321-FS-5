import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AuthForm from "./AuthForm";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen = ({ onComplete }: WelcomeScreenProps) => {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [darkMode, setDarkMode] = useState(
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-b from-background to-accent/30 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mx-auto mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 text-gradient dark:text-white">
          Next-Gen-Videos
        </h1>

        <h5 className="text-2xl font-bold mb-4 text-gradient dark:text-white underline underline-offset-4">
          XNL-21BCE7321-FS-5
        </h5>

        <p className="text-muted-foreground mb-8 dark:text-gray-300">
          Share moments, connect through video, and express yourself in a whole
          new way.
        </p>

        <div className="space-y-4">
          <Button
            onClick={() => setShowAuthForm(true)}
            className="w-full btn-primary"
          >
            Get Started
          </Button>

          <Button
            variant="outline"
            onClick={onComplete}
            className="w-full btn-secondary"
          >
            Continue as Guest
          </Button>
        </div>
      </motion.div>

      {showAuthForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm z-50"
        >
          <AuthForm
            onSuccess={onComplete}
            onClose={() => setShowAuthForm(false)}
          />
        </motion.div>
      )}

      <Button
        variant="ghost"
        className="absolute top-4 right-4 p-2"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </Button>
    </div>
  );
};

export default WelcomeScreen;
