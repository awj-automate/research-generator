"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
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
          <h1 className="text-xl font-bold text-ds-heading text-center mb-2">Sign in</h1>
          <p className="text-sm text-ds-muted text-center mb-8">Sign in to start researching companies</p>

          <button
            onClick={() => signIn("google", { callbackUrl: "/research" })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-button bg-ds-card border border-ds-border text-ds-heading font-semibold text-sm hover:bg-ds-surface transition-all shadow-sm hover:shadow-md active:scale-[0.99]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
