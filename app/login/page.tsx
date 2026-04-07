"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Sign up failed");
          setLoading(false);
          return;
        }
        // Auto sign-in after successful sign-up
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (result?.error) {
          setError("Account created but sign-in failed. Try signing in.");
          setIsSignUp(false);
        } else {
          window.location.href = "/research";
        }
      } else {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (result?.error) {
          setError("Invalid email or password");
        } else {
          window.location.href = "/research";
        }
      }
    } catch {
      setError("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-ds-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="13" cy="13" r="9" stroke="#4D8BFE" strokeWidth="3"/>
              <line x1="20" y1="20" x2="28" y2="28" stroke="#4D8BFE" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <span className="text-2xl text-ds-heading tracking-tight font-bold">LeadLens</span>
          </Link>
        </div>

        <div className="luminous-frame bg-ds-card p-8">
          <h1 className="text-xl font-bold text-ds-heading text-center mb-2">
            {isSignUp ? "Create account" : "Sign in"}
          </h1>
          <p className="text-sm text-ds-muted text-center mb-6">
            {isSignUp ? "Get started with LeadLens" : "Sign in to start researching"}
          </p>

          {/* Google */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/research" })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-button bg-ds-card border border-ds-border text-ds-heading font-semibold text-sm hover:bg-ds-surface transition-all shadow-sm hover:shadow-md active:scale-[0.99] mb-6"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-ds-border" />
            <span className="text-xs text-ds-subtle">or</span>
            <div className="flex-1 h-px bg-ds-border" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <input
                type="text"
                placeholder="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-ds-border bg-ds-surface text-sm text-ds-heading placeholder:text-ds-subtle focus:outline-none focus:ring-2 focus:ring-ds-primary/30 focus:border-ds-primary transition-all"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-ds-border bg-ds-surface text-sm text-ds-heading placeholder:text-ds-subtle focus:outline-none focus:ring-2 focus:ring-ds-primary/30 focus:border-ds-primary transition-all"
            />
            <input
              type="password"
              placeholder={isSignUp ? "Password (8+ characters)" : "Password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-ds-border bg-ds-surface text-sm text-ds-heading placeholder:text-ds-subtle focus:outline-none focus:ring-2 focus:ring-ds-primary/30 focus:border-ds-primary transition-all"
            />

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 rounded-button bg-ds-primary text-white font-semibold text-sm hover:bg-ds-primary-dark disabled:opacity-50 transition-all shadow-lg shadow-ds-primary/20 active:scale-[0.99]"
            >
              {loading ? "..." : isSignUp ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="text-xs text-ds-muted text-center mt-5">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
              className="text-ds-primary font-semibold hover:underline"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
