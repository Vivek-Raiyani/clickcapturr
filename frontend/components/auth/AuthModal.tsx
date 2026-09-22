"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: "signin" | "signup";
}

export function AuthModal({ isOpen, onClose, defaultView = "signin" }: AuthModalProps) {
  const [view, setView] = useState<"signin" | "signup">(defaultView);

  // Reset view when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setView(defaultView);
    }
  }, [isOpen, defaultView]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={view === "signin" ? "Sign In" : "Create an Account"}
      description={
        view === "signin"
          ? "Welcome back. Please sign in to your account."
          : "Join us today to create your personal page."
      }
      maxWidth="md"
    >
      {view === "signin" ? (
        <SignInForm
          onSuccess={onClose}
          onSwitchToSignUp={() => setView("signup")}
        />
      ) : (
        <SignUpForm
          onSuccess={onClose}
          onSwitchToSignIn={() => setView("signin")}
        />
      )}
    </Modal>
  );
}
