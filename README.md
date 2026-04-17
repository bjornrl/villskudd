# villskudd.no

Official site for the Villskudd band. Next.js 16 (App Router) + GSAP + Lenis, with a Resend-powered newsletter signup in the footer.

## Local dev

```bash
cp .env.example .env.local   # fill in your Resend API key + Audience ID
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Deploy

See [VERCEL.md](./VERCEL.md) for the full one-time checklist (Resend setup, Vercel import, DNS at webhuset).

## Project layout

```
src/
  app/
    layout.js            Root layout + fonts (Host Grotesk, DM Mono)
    page.js              Home: preloader, hero, about gallery, DiningMenu, Testimonials, CTA, ImageBanner
    globals.css
    home.css
    about/               "The Villskudd Story"
    menu/                Placeholder "Music & Shows" (still uses template menu data — needs rewrite)
    reservation/         Contact / booking page
    api/
      subscribe/route.js Resend Audiences handler
  client-layout.js       Nav, Footer, Lenis smooth scroll, ViewTransitions
  components/
    Newsletter/          Signup form used inside Footer
    Footer/              Footer with postcards-on-hover animation
    Nav/                 Fullscreen overlay nav
    Preloader/
    Copy/                Line/word reveal wrapper (GSAP)
    Button/              Sliding-char anchor button
    CTA/                 "Come see us live" section
    DiningMenu/          Template's animated menu — will become Releases/Tour
    Testimonials/
    Chefs/
    StickyCards/
    ImageBanner/
    Marquee/
  hooks/
    useViewTransition.js
public/                  Template restaurant images + villskudd_*.jpg band photos + HUND.png
```

## Known placeholders

Search the repo for `REVIEW:` to find spots flagged for a content pass — hero shots, band bio, tour dates in the CTA, restaurant imagery still in use, etc.

## Stack

- Next.js 16.2.3 (App Router, Turbopack by default)
- React 19
- GSAP 3 + ScrollTrigger + `@gsap/react`
- Lenis (smooth scroll)
- `next-view-transitions`
- Resend (newsletter)
