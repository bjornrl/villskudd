import { defineLive } from "next-sanity/live";

import { client } from "./client";

// Live Content API — streams published content updates to the site in real time,
// so when the band publishes in the Studio the page updates without a redeploy.
export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({ apiVersion: "vX" }),
  // The band publishes in the Studio; the public site only ever reads published
  // content, so no tokens are needed (and none are shipped to the browser).
  serverToken: false,
  browserToken: false,
});
