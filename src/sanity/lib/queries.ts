import { defineQuery } from "next-sanity";

// Everything the home page needs, in one request.
export const HOME_QUERY = defineQuery(`{
  "latestRelease": *[_type == "release"] | order(releaseDate desc)[0]{
    _id,
    title,
    album,
    year,
    link,
    "cover": cover.asset->url
  },
  "shows": *[_type == "show"] | order(date asc){
    _id,
    date,
    venue,
    city,
    ticketUrl,
    ticketLabel
  },
  "products": *[_type == "product"] | order(order asc, name asc){
    _id,
    name,
    type,
    price,
    url,
    buyLabel,
    "image": image.asset->url
  },
  "settings": *[_type == "siteSettings"][0]{
    bandName,
    "heroImage": heroImage.asset->url,
    "albumCover": albumCover.asset->url,
    heroTagline,
    listenHeading,
    streaming,
    contactIntro,
    contactItems[]{ label, value, href },
    socials[]{ label, href }
  }
}`);
