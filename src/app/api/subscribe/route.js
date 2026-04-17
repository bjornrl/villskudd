import { Resend } from "resend";

// Newsletter signup endpoint.
// Required env vars:
//   RESEND_API_KEY      — API key scoped to this project (create in Resend dashboard)
//   RESEND_AUDIENCE_ID  — ID of the Audience to add contacts to (create in Resend dashboard)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ error: "Please enter a valid email" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    // Never leak which env var is missing.
    return Response.json({ error: "Newsletter is not configured" }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });

    if (error) {
      // Resend returns a friendly message for "already_exists" — treat as success
      // so users don't get an error if they signed up before.
      const msg = error.message || "";
      if (/already/i.test(msg)) {
        return Response.json({ ok: true, alreadySubscribed: true });
      }
      return Response.json({ error: msg || "Could not subscribe" }, { status: 400 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Resend subscribe error", err);
    return Response.json({ error: "Unexpected error. Try again?" }, { status: 500 });
  }
}
