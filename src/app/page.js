import { sanityFetch } from "@/sanity/lib/live";
import { HOME_QUERY } from "@/sanity/lib/queries";

import Hero from "@/components/Hero/Hero";
import Shows from "@/components/Shows/Shows";
import ShopGrid from "@/components/ShopGrid/ShopGrid";
import Contact from "@/components/Contact/Contact";

import "./home.css";

// Always read current published Sanity content. Without this, Netlify/Next
// can keep serving a build-time snapshot — which is why the YouTube field
// stayed empty on the live site after it was added in the Studio.
export const dynamic = "force-dynamic";

export default async function Home() {
  const { data } = await sanityFetch({ query: HOME_QUERY });

  return (
    <>
      <Hero release={data?.latestRelease} settings={data?.settings} />
      <Shows shows={data?.shows || []} heading={data?.settings?.showsHeading} />
      <ShopGrid
        products={data?.products || []}
        heading={data?.settings?.shopHeading}
        mailLabel={data?.settings?.shopMailLabel}
      />
      <Contact settings={data?.settings} />
    </>
  );
}
