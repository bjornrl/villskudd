"use client";

import dynamic from "next/dynamic";

// Sanity Studio is client-only — load it without SSR so its config/plugins are
// never evaluated on the server (which breaks the production build).
const StudioClient = dynamic(() => import("./StudioClient"), { ssr: false });

export default function StudioPage() {
  return <StudioClient />;
}
