"use client";

import React, { useState } from "react";
import { fetchApi } from "@/lib/api";

interface SignUpFormProps {
  onSuccess: () => void;
  onSwitchToSignIn: () => void;
}

export function SignUpForm({ onSuccess, onSwitchToSignIn }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    age_consent: false,
    terms_policy_accepted: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await fetchApi("/auth/signup", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setSuccessMsg("Account created successfully! You can now sign in.");
      // We don't automatically sign in based on the backend returning just the UserOut on signup
      setTimeout(() => {
        onSwitchToSignIn();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="flex flex-col gap-4">
      {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">{error}</div>}
      {successMsg && <div className="p-3 text-sm text-green-700 bg-green-50 rounded-md">{successMsg}</div>}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md text-sm"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md text-sm"
            required
            minLength={6}
          />
        </div>

        <div className="flex items-start gap-2 mt-2">
          <input
            type="checkbox"
            name="age_consent"
            id="age_consent"
            checked={formData.age_consent}
            onChange={handleChange}
            className="mt-1"
            required
          />
          <label htmlFor="age_consent" className="text-sm text-muted-foreground">
            I confirm I am over 18 years old.
          </label>
        </div>

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            name="terms_policy_accepted"
            id="terms_policy_accepted"
            checked={formData.terms_policy_accepted}
            onChange={handleChange}
            className="mt-1"
            required
          />
          <label htmlFor="terms_policy_accepted" className="text-sm text-muted-foreground">
            I agree to the Terms of Service and Privacy Policy.
          </label>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || successMsg !== ""}
          className="w-full py-2 px-4 bg-foreground text-background rounded-md font-medium disabled:opacity-50 mt-2"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="relative flex items-center py-1">
        <div className="flex-grow border-t border-border"></div>
        <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm">or</span>
        <div className="flex-grow border-t border-border"></div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full py-2 px-4 border border-border text-foreground rounded-md font-medium flex justify-center items-center gap-2 hover:bg-muted/50 transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>

      <div className="text-center text-sm text-muted-foreground mt-1">
        Already have an account?{" "}
        <button type="button" onClick={onSwitchToSignIn} className="text-foreground underline">
          Sign in
        </button>
      </div>
    </div>
  );
}
