// One-off seed: uploads images and creates published content for the band site.
// Run with: npm run seed   (reads .env.local for project + write token)
import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "..", "public");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const uploadImage = async (file) => {
  const buffer = await readFile(path.join(PUBLIC, file));
  const asset = await client.assets.upload("image", buffer, { filename: file });
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
};

const SHOWS = [
  { date: "2026-09-12", venue: "Rockefeller Music Hall", city: "Oslo" },
  { date: "2026-09-19", venue: "USF Verftet", city: "Bergen" },
  { date: "2026-09-26", venue: "Byscenen", city: "Trondheim" },
  { date: "2026-10-03", venue: "Folken", city: "Stavanger" },
  { date: "2026-10-10", venue: "Parkteatret", city: "Oslo" },
  { date: "2026-10-17", venue: "Tou Scene", city: "Stavanger" },
];

async function run() {
  console.log("Uploading images…");
  const cover = await uploadImage("villskudd_1.jpg");
  const productImage = await uploadImage("villskudd_1.jpg");

  const docs = [];

  // Latest release (cover shown in the hero)
  docs.push({
    _id: "release-debut",
    _type: "release",
    title: "Villskudd",
    album: "Debutalbum",
    year: "2026",
    releaseDate: "2026-06-01T00:00:00Z",
    link: "https://open.spotify.com/artist/5FCkBVSFSwy86a5t5iVwha",
    cover,
  });

  // Upcoming shows
  SHOWS.forEach((s, i) => {
    docs.push({
      _id: `show-${i + 1}`,
      _type: "show",
      date: `${s.date}T20:00:00Z`,
      venue: s.venue,
      city: s.city,
      ticketUrl: "https://tickets.example.com/",
      ticketLabel: "Billetter",
    });
  });

  // One shop product
  docs.push({
    _id: "product-debut-lp",
    _type: "product",
    name: "Villskudd – Debutalbum",
    type: "LP / Vinyl",
    price: "399 kr",
    url: "https://shop.example.com/",
    buyLabel: "Kjøp",
    order: 0,
    image: productImage,
  });

  // Site settings (singleton) — hero tagline, streaming links, contact
  docs.push({
    _id: "siteSettings",
    _type: "siteSettings",
    bandName: "Villskudd",
    heroImage: cover,
    heroTagline: "Et band",
    listenHeading: "Hør på musikken",
    streaming: {
      spotify: "https://open.spotify.com/artist/5FCkBVSFSwy86a5t5iVwha",
      appleMusic: "https://music.apple.com/",
      tidal: "https://tidal.com/",
      youtube: "https://youtube.com/",
    },
    contactIntro: "Booking, presse eller bare en hilsen — ta kontakt.",
    contactItems: [
      {
        _key: "booking",
        label: "Booking",
        value: "booking@villskudd.no",
        href: "mailto:booking@villskudd.no",
      },
      {
        _key: "general",
        label: "Generelt",
        value: "villskuddband@gmail.com",
        href: "mailto:villskuddband@gmail.com",
      },
      {
        _key: "phone",
        label: "Telefon",
        value: "+47 000 00 000",
        href: "tel:+4700000000",
      },
    ],
    socials: [
      { _key: "ig", label: "Instagram", href: "https://instagram.com/" },
      {
        _key: "sp",
        label: "Spotify",
        href: "https://open.spotify.com/artist/5FCkBVSFSwy86a5t5iVwha",
      },
      { _key: "fb", label: "Facebook", href: "https://facebook.com/" },
    ],
  });

  console.log(`Creating ${docs.length} documents…`);
  const tx = docs.reduce((t, doc) => t.createOrReplace(doc), client.transaction());
  await tx.commit();
  console.log("Done. Seeded:", docs.map((d) => d._id).join(", "));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
