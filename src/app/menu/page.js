"use client";

import Copy from "@/components/Copy/Copy";
import Concerts from "@/components/Concerts/Concerts";

import "./menu.css";

const SPOTIFY_ARTIST_ID = "5FCkBVSFSwy86a5t5iVwha";

export default function Menu() {
  return (
    <>
      <section className="menu-hero">
        <div className="menu-hero-img">
          <img
            src="/villskudd/671869304_956443863777746_5378642915469791746_n.jpg"
            alt=""
          />
        </div>

        <div className="container">
          <Copy type="words" animateOnScroll={false} delay={0.85}>
            <h2>Music</h2>
          </Copy>
        </div>

        <div className="section-footer">
          <Copy type="lines" animateOnScroll={false} delay={1.1}>
            <p className="sm">Villskudd</p>
          </Copy>
          <Copy type="lines" animateOnScroll={false} delay={1.2}>
            <p className="sm">På Spotify</p>
          </Copy>
        </div>
      </section>

      <section className="menu-spotify">
        <div className="container">
          <iframe
            className="menu-spotify-embed"
            src={`https://open.spotify.com/embed/artist/${SPOTIFY_ARTIST_ID}?utm_source=generator&theme=0`}
            width="100%"
            height="600"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Villskudd on Spotify"
          />
        </div>
      </section>

      <Concerts />
    </>
  );
}
