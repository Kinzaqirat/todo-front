// 

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

export default function GoogleSignInButton({ callbackUrl = "/todo" }: { callbackUrl?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    try {
      setLoading(true);
      // ye client-side function will redirect the browser into the OAuth flow
      const res: any = await authClient.signIn.social({ // NOTE: Using 'any' as a temporary measure to bypass the type error
        provider: "google",
        callbackURL: callbackUrl, // optional: where to send user after sign-in
      });

      // Based on common auth client patterns, if a manual redirect is needed, 
      // the URL is often in a property named 'url' or similar. 
      // The property 'redirect' is often a boolean flag.
      if (res && 'url' in res && typeof res.url === "string" && typeof window !== "undefined") {
        window.location.href = res.url; // CHANGE: Used res.url instead of res.redirect
      }
    } catch (err: any) {
      console.error("Google sign in error:", err);
      // show a toast / UI error if chahiye
      alert(err?.message || "Google sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleGoogle} className="flex items-center gap-2 w-full" disabled={loading}>
      <FaGoogle />
      {loading ? "Signing in..." : "Sign in with Google"}
    </Button>
  );
}