"use client";
import { useState } from "react";
import { FiMail, FiCheckCircle } from "react-icons/fi";
import { Container } from "./ui/Container";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (email.includes("@")) setDone(true);
  };

  return (
    <section className="py-20">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-gradient-to-br from-blush-100 via-white to-lavender-100 p-10 shadow-soft sm:p-14 dark:from-ink-900 dark:via-ink-900 dark:to-ink-900">
          <div className="pointer-events-none absolute -right-10 -top-10 h-60 w-60 rounded-full bg-blush-300/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-lavender-300/40 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="h-display text-3xl sm:text-4xl">
                Join the bloom list
              </h2>
              <p className="mt-3 max-w-md text-sm text-ink-900/70 dark:text-white/70">
                Subscribe for early access to new drops, exclusive offers, and
                10% off your first order.
              </p>
            </div>

            <form onSubmit={submit} className="relative">
              <div className="flex items-center gap-2 rounded-full bg-white p-1.5 shadow-soft dark:bg-white/10">
                <FiMail className="ml-4 text-blush-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent px-2 py-2.5 text-sm outline-none"
                  required
                />
                <button type="submit" className="btn-primary">
                  Subscribe
                </button>
              </div>
              {done && (
                <p className="animate-fade-in mt-3 flex items-center gap-2 text-sm text-emerald-600">
                  <FiCheckCircle /> You're in. Welcome to the bloom list ✨
                </p>
              )}
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
