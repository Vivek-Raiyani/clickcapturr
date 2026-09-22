"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      login(token).then(() => {
        router.push("/dashboard");
      }).catch(err => {
        console.error("Login failed after oauth callback:", err);
        router.push("/");
      });
    } else {
      router.push("/");
    }
  }, [searchParams, login, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground font-medium">Authenticating...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
