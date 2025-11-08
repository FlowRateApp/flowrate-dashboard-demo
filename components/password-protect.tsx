"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type PasswordProtectProps = {
  children: ReactNode;
};

type GateState = "loading" | "authorized" | "unauthorized";

const protectionEnabled =
  typeof process.env.PASSWORD_PROTECT === "undefined"
    ? true
    : process.env.PASSWORD_PROTECT === "true";

export function PasswordProtect({ children }: PasswordProtectProps) {
  const router = useRouter();
  const [state, setState] = useState<GateState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!protectionEnabled) {
      setState("authorized");
      return;
    }

    let cancelled = false;

    const checkSession = async () => {
      try {
        const response = await fetch("/api/password-check", {
          credentials: "include",
        });

        if (!cancelled) {
          setState(response.ok ? "authorized" : "unauthorized");
        }
      } catch {
        if (!cancelled) {
          setState("unauthorized");
        }
      }
    };

    void checkSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = useMemo(
    () => async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (!protectionEnabled) {
        setState("authorized");
        return;
      }

      const formData = new FormData(event.currentTarget);
      const password = formData.get("password");

      if (typeof password !== "string" || password.length === 0) {
        setError("Password is required.");
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        });

        if (response.ok) {
          setState("authorized");
          router.refresh();
        } else {
          const data = (await response.json().catch(() => null)) as
            | { message?: string }
            | null;
          setError(data?.message ?? "Incorrect password.");
        }
      } catch {
        setError("Unable to reach the login service.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [router]
  );

  if (state === "authorized") {
    return <>{children}</>;
  }

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <span className="text-sm uppercase tracking-wide">Loading…</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-2xl shadow-slate-900/40">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">
          Enter Password
        </h1>
        <p className="mb-6 text-sm text-slate-500">
          This staging environment is password-protected.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-base text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-400"
              placeholder="Enter password"
            />
          </div>
          {error ? (
            <p className="text-sm font-medium text-rose-600">{error}</p>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in…" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}


