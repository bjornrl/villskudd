# Deploying villskudd.no to Netlify

One-time checklist for shipping this site to Netlify and pointing the `villskudd.no` domain at it without breaking anything you currently have at webhuset (especially email).

## 1. Push the repo (already done)

Repo is at `github.com/bjornrl/villskudd`. Any further changes: commit and push as usual — Netlify will auto-rebuild on each push to `main`.

## 2. Import into Netlify

1. Go to [app.netlify.com](https://app.netlify.com). Sign up with GitHub if you don't have an account (free tier covers this site).
2. **Add new site → Import an existing project → Deploy with GitHub**.
3. Authorize the Netlify GitHub app if prompted, and grant access to `bjornrl/villskudd`.
4. Pick the repo. On the configure screen:
   - **Branch to deploy**: `main`
   - **Build command**: `next build` (auto-detected)
   - **Publish directory**: `.next` (auto-detected)
   - **Functions directory**: leave empty (Netlify's Next runtime handles the `/api/subscribe` Route Handler automatically)
5. **Environment variables**: skip for now — the newsletter shows "Launching soon" until you add them later.
6. Click **Deploy villskudd**.

First build takes 2–4 minutes. You'll get a preview URL like `villskudd-xyz.netlify.app`.

## 3. Point villskudd.no at Netlify

In **Netlify → Site → Domain management → Add a domain**:

1. Enter `villskudd.no` → **Verify** → **Add**.
2. Netlify offers two paths. **Pick "Use an external DNS provider"** — you want to keep DNS at webhuset so you don't break email.
3. Add `www.villskudd.no` the same way, and choose whether `www` or apex is the primary (pick apex — `villskudd.no` without `www`).
4. Netlify now shows the exact DNS records you need. You'll see:
   - An **A record** value for the apex (something like `75.2.60.5` — use the exact value Netlify shows).
   - A **CNAME** value for `www` (usually `<your-site-name>.netlify.app`).

Leave that tab open.

In **webhuset's DNS control panel** for `villskudd.no`:

1. Find the existing A record for `@` (the apex/bare domain) and replace its value with the IP Netlify shows. If there are multiple A records for `@`, delete the extras and keep one.
2. Find or create the CNAME record for `www` pointing to the `netlify.app` hostname Netlify shows.
3. **Do NOT touch MX records.** Email keeps flowing regardless of web DNS changes. Only touch A, CNAME, and TXT.
4. Set TTL to 3600 (1 hour) or lower if webhuset lets you — speeds up propagation.

Save in webhuset. Back in Netlify, refresh the Domain management page. It'll show a spinner next to each domain, then ✅ once DNS resolves. Typically 10–30 minutes; occasionally up to a couple of hours.

## 4. SSL

Netlify provisions a Let's Encrypt certificate automatically once DNS resolves. In Domain management you'll see **HTTPS → Verify DNS configuration → Provision certificate** happen on its own. `https://villskudd.no` will work.

If it gets stuck in "waiting for DNS", wait longer or click **Renew certificate** manually once DNS is clearly propagated.

## 5. Resend setup (when you're ready)

You mentioned you need to upgrade your Resend account first. When that's done:

1. Log into [resend.com](https://resend.com).
2. **Domains → Add Domain** → `villskudd.no`. Resend shows DNS records (SPF, DKIM, a MAIL FROM record).
3. Add those TXT/CNAME records in webhuset's DNS panel alongside the Netlify ones. Do NOT add Resend's MX record if webhuset currently hosts your mail — that would override them.
4. **Audiences → Create** → name it `Villskudd Newsletter`. Copy the UUID from the URL (`https://resend.com/audiences/<UUID>`). That's your `RESEND_AUDIENCE_ID`.
5. **API Keys → Create API Key** → name `villskudd-prod`, permission `Full access`. Copy the key starting with `re_`. That's your `RESEND_API_KEY`.

Recommended: create a fresh API key even though you have one from another project — that way if you ever need to rotate or revoke it, the other project isn't affected.

## 6. Turn on the newsletter

In **Netlify → Site → Site configuration → Environment variables → Add a variable**, add these three:

- `NEXT_PUBLIC_NEWSLETTER_ENABLED` = `true`
- `RESEND_API_KEY` = `re_...`
- `RESEND_AUDIENCE_ID` = `xxxxxxxx-xxxx-...`

Scope: **Production** (and Deploy Previews, and Branch deploys if you want).

Trigger a redeploy: **Deploys → Trigger deploy → Deploy site**. The "Launching soon" text flips to the live form.

## 7. Verify

- Hit `https://villskudd.no` — should load.
- Scroll to footer → enter an email → submit → expect "You're on the list."
- In Resend dashboard → Audiences → Villskudd Newsletter → the email should appear.

## Common gotchas

- **"Newsletter is not configured" error after adding env vars** → you didn't redeploy. Netlify doesn't auto-rebuild on env var changes. Hit **Trigger deploy** manually.
- **Build fails on Netlify but works locally** → Netlify defaults to Node 20 which matches Next 16's requirement. If it complains anyway, add a `NODE_VERSION=20` environment variable.
- **Email delivery failures** → `villskudd.no` isn't verified in Resend yet. Resend refuses to send until DKIM passes.
- **Next.js features that don't work on Netlify** → none relevant to this site. App Router, Route Handlers, Server Components, `next/font`, `next/image`, and middleware all work on Netlify's Next runtime. The only things that don't: ISR with on-demand revalidation via Vercel-specific APIs (we don't use those).

## Files touched by the newsletter integration

- `src/components/Newsletter/Newsletter.jsx` — form component, gated by `NEXT_PUBLIC_NEWSLETTER_ENABLED`
- `src/components/Newsletter/Newsletter.css`
- `src/components/Footer/Footer.jsx` — swapped "Plan Your Visit" button for `<Newsletter />`
- `src/app/api/subscribe/route.js` — Route Handler → Resend Audiences
- `.env.example` — env var template
- `package.json` — added `resend`
