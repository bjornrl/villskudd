import { sanityFetch } from "@/sanity/lib/live";
import { HOME_QUERY } from "@/sanity/lib/queries";

import Hero from "@/components/Hero/Hero";
import Shows from "@/components/Shows/Shows";
import ShopGrid from "@/components/ShopGrid/ShopGrid";
import Contact from "@/components/Contact/Contact";

import "./home.css";

export default async function Home() {
  const { data } = await sanityFetch({ query: HOME_QUERY });

  return (
    <>
      <Hero release={data?.latestRelease} settings={data?.settings} />
      <Shows shows={data?.shows || []} />
      <ShopGrid products={data?.products || []} />
      <Contact settings={data?.settings} />
    </>
  );
}
