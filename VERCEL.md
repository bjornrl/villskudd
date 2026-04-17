# Deploying villskudd.no to Vercel

One-time checklist for shipping this site to Vercel and pointing the `villskudd.no` domain at it without breaking anything you currently have at webhuset (especially email).

## 1. Resend setup (do this first)

You mentioned you already have a Resend account and API key from another project. You can reuse the account, but set up villskudd as its own thing so nothing gets tangled.

1. Log into [resend.com](https://resend.com).
2. **Domains → Add Domain** → `villskudd.no`. Resend shows DNS records (SPF, DKIM, a MAIL FROM record). You'll add those at webhuset in step 4. Skip adding the MX record unless Resend specifically requires it — it will override webhuset's mail if they host your inbox.
3. **Audiences → Create** → name it `Villskudd Newsletter`. Once created, copy the UUID from the URL (`https://resend.com/audiences/<UUID>`). That's your `RESEND_AUDIENCE_ID`.
4. **API Keys → Create API Key** → name `villskudd-prod`, permission `Full access` (or `Sending access` + `Audience access` if you want to be strict). Copy the key. It starts with `re_`. That's your `RESEND_API_KEY`.

## 2. Push the repo to GitHub

```
git add -A
git commit -m "Rebuild villskudd on Salle Blanche template + Resend newsletter"
git push
```

## 3. Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new) → select this GitHub repo.
2. Framework preset: **Next.js** (auto-detected).
3. Before the first deploy, expand **Environment Variables**. You have two paths:

   **Path A — ship now, wire Resend later** (recommended if your Resend account isn't ready):
   - Add nothing. Deploy. The footer shows "Newsletter launching soon" instead of the form.
   - When Resend is ready, come back and add the three vars below, then redeploy.

   **Path B — ship with the newsletter live:**
   - `NEXT_PUBLIC_NEWSLETTER_ENABLED` = `true`
   - `RESEND_API_KEY` = `re_...`
   - `RESEND_AUDIENCE_ID` = `xxxxxxxx-xxxx-...`
   - Scope all three to `Production`, `Preview`, and `Development`.

4. Click **Deploy**. Confirm the preview URL loads. If you went with Path B, test a signup and expect "You're on the list."

## 4. Point `villskudd.no` at Vercel (without breaking email)

Your domain is registered through webhuset, so DNS is managed there. You only need to change **A / CNAME / TXT** records — leave **MX** records alone unless webhuset confirms they're not hosting your mail.

In **Vercel → Project → Settings → Domains**:
- Add `villskudd.no` and `www.villskudd.no`.
- Vercel will show one of two setups:
  - **Nameservers approach**: delegate the whole domain to Vercel. *Don't pick this* — it moves DNS off webhuset and can break your email.
  - **A / CNAME approach**: keep DNS at webhuset, just change the records. *Pick this.* Vercel shows the exact values.

Then in your **webhuset DNS control panel**:
- Set apex `villskudd.no` to the A record Vercel shows (usually `76.76.21.21`).
- Set `www.villskudd.no` CNAME to `cname.vercel-dns.com`.
- Add the Resend DKIM/SPF/MAIL-FROM TXT records from step 1.
- **Do NOT touch MX records.** If your email `villskuddband@gmail.com` is Gmail-hosted, there's nothing to change — email flows through Gmail's MX regardless of your web DNS. If webhuset is your mail host, leave their existing MX records intact.

DNS propagation: 10 minutes to a couple of hours. Vercel shows ✅ once it resolves.

## 5. Verify

- Hit `https://villskudd.no` — should load.
- Scroll to footer → enter an email → submit → expect "You're on the list."
- In Resend dashboard → Audiences → Villskudd Newsletter → the email should appear.
- Send a test campaign from Resend to confirm deliverability to the Audience.

## Common gotchas

- **"Newsletter is not configured" error** → env vars weren't set, or you set them only for Preview. Add them to Production too, then redeploy.
- **Already-subscribed emails** silently succeed (by design in `src/app/api/subscribe/route.js`) — users don't get an error if they've signed up before.
- **Email delivery failures** → `villskudd.no` isn't verified in Resend yet (step 1). Resend will refuse to send until the domain's DKIM passes.
- **Build fails on Vercel but works locally** → check Node version. Vercel uses Node 20 by default; Next 16 needs ≥ 20.9.

## Files touched by this integration

- `src/components/Newsletter/Newsletter.jsx` — form component
- `src/components/Newsletter/Newsletter.css`
- `src/components/Footer/Footer.jsx` — swapped "Plan Your Visit" button for `<Newsletter />`
- `src/app/api/subscribe/route.js` — Route Handler → Resend Audiences
- `.env.example` — variable template
- `package.json` — added `resend`
