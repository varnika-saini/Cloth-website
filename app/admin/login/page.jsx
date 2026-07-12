"use client";
// =====================================================================
// 🔑  ADMIN LOGIN — /admin/login
// ---------------------------------------------------------------------
// Posts credentials to /api/admin/login. On success the server sets the
// session cookie and we redirect to the page the visitor was headed to
// (?next=...) or the dashboard.
// =====================================================================
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiLock, FiMail, FiLogIn, FiAlertCircle } from "react-icons/fi";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/PageHeader";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Login failed");
      // Full navigation so middleware re-reads the fresh cookie.
      router.replace(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Sign in"
        subtitle="This area is private. Please log in to manage product images."
      />

      <Container className="py-12">
        <form
          onSubmit={onSubmit}
          className="card animate-fade-up mx-auto max-w-md p-8 sm:p-10"
        >
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-blush-500 to-blush-700 text-white shadow-soft">
            <FiLock size={24} />
          </div>

          <label className="mt-8 block text-sm font-medium text-ink-900 dark:text-white">
            Email
          </label>
          <div className="relative mt-2">
            <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blush-500" />
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input pl-11"
              placeholder="you@example.com"
            />
          </div>

          <label className="mt-5 block text-sm font-medium text-ink-900 dark:text-white">
            Password
          </label>
          <div className="relative mt-2">
            <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blush-500" />
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pl-11"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="mt-4 flex items-center gap-2 text-sm text-red-500">
              <FiAlertCircle size={16} /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-7 w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiLogIn size={16} />
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </Container>
    </>
  );
}
