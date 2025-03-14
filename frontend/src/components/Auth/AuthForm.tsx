import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

interface AuthFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

const AuthForm = ({ onSuccess, onClose }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const response = await axios.post(
        `https://xnl-21bce7321-fs-5.onrender.com${endpoint}`,
        {
          email,
          password,
        }
      );

      const token = response.data.token;
      localStorage.setItem("token", token);

      toast({
        title: isLogin ? "Welcome back!" : "Account created!",
        description: isLogin
          ? "You have successfully logged in."
          : "Your account has been created successfully.",
      });

      onSuccess();
      
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass p-6 rounded-2xl w-full max-w-md mx-auto animate-scale-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium">
          {isLogin ? "Sign In" : "Create Account"}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-secondary"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>

        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
        )}

        <Button
          type="submit"
          className={cn(
            "w-full btn-primary",
            isLoading && "opacity-70 cursor-not-allowed"
          )}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
        </Button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
