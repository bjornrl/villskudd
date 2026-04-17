"use client";

import { forwardRef, useState } from "react";

import "./Newsletter.css";

/**
 * Newsletter signup form — posts { email } to /api/subscribe, which adds the
 * contact to a Resend Audience. forwardRef so the Footer's postcards-on-hover
 * animation can still anchor to the visible form element.
 */
// Gate the live form behind a public env var so the site can ship before
// Resend is configured. Set NEXT_PUBLIC_NEWSLETTER_ENABLED=true in Vercel
// when the Audience + API key are ready.
const IS_ENABLED = process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED === "true";

const Newsletter = forwardRef(function Newsletter(
  {
    buttonLabel = "Subscribe",
    placeholder = "din@epost.no",
    comingSoonLabel = "Nyhetsbrev kommer snart",
  },
  ref,
) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  if (!IS_ENABLED) {
    return (
      <div ref={ref} className="newsletter newsletter-coming-soon">
        <p className="newsletter-coming-soon-label">{comingSoonLabel}</p>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === "loading" || status === "success") return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Try again?");
      }

      setStatus("success");
      setMessage("You're on the list. Takk!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Something went wrong. Try again?");
    }
  };

  const disabled = status === "loading" || status === "success";

  return (
    <form ref={ref} className="newsletter" onSubmit={handleSubmit} noValidate>
      <div className="newsletter-row">
        <input
          type="email"
          className="newsletter-input"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email address"
          disabled={disabled}
          autoComplete="email"
        />
        <button type="submit" className="newsletter-submit" disabled={disabled}>
          {status === "loading" ? "…" : buttonLabel}
        </button>
      </div>
      {message && (
        <p
          className={`newsletter-status newsletter-status-${status}`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </form>
  );
});

export default Newsletter;
