"use client";

import { useRef, useState } from "react";
import { SiSpotify, SiApplemusic, SiTidal, SiYoutube } from "react-icons/si";

import Preloader, { isInitialLoad } from "@/components/Preloader/Preloader";
import Copy from "@/components/Copy/Copy";

const STREAMING = [
  { key: "spotify", label: "Spotify", Icon: SiSpotify },
  { key: "appleMusic", label: "Apple Music", Icon: SiApplemusic },
  { key: "tidal", label: "Tidal", Icon: SiTidal },
  { key: "youtube", label: "YouTube", Icon: SiYoutube },
];

export default function Hero({ release, settings }) {
  const isInitialPageLoad = useRef(isInitialLoad).current;
  const [preloaderDelay, setPreloaderDelay] = useState(
    isInitialPageLoad ? 9999 : 0,
  );

  const handlePreloaderEnter = () => {
    if (isInitialPageLoad) setPreloaderDelay(0.2);
  };

  const streaming = settings?.streaming || {};
  const bandName = settings?.bandName || "Villskudd";
  const tagline = settings?.heroTagline;
  const listenHeading = settings?.listenHeading || "Hør på musikken";
  const heroImage = settings?.heroImage || release?.cover;
  const albumCover = settings?.albumCover || release?.cover;
  const links = STREAMING.filter(({ key }) => streaming[key]);

  return (
    <>
      <Preloader onEnter={handlePreloaderEnter} />

      <section className="hero">
        <div className="container">
          <Copy
            type="words"
            animateOnScroll={false}
            delay={isInitialPageLoad ? preloaderDelay : 0.85}
          >
            <h1>{bandName}</h1>
          </Copy>

          <div className="hero-release">
            {tagline && (
              <Copy
                type="lines"
                animateOnScroll={false}
                delay={isInitialPageLoad ? preloaderDelay + 0.15 : 1.1}
              >
                <p className="sm hero-release-label">{tagline}</p>
              </Copy>
            )}

            {heroImage && (
              <div className="hero-front-image">
                <img src={heroImage} alt={bandName} />
              </div>
            )}
            <br/>
            <br/>

            {links.length > 0 && (
              <>
                <Copy
                  type="lines"
                  animateOnScroll={false}
                  delay={isInitialPageLoad ? preloaderDelay + 0.25 : 1.2}
                >
                  <h4 className="hero-release-title" style={{ lineHeight: 1.1 }}>
                    {listenHeading}
                  </h4>
                </Copy>

                {albumCover && (
                  <div className="hero-release-cover">
                    <img src={albumCover} alt="Album cover" />
                  </div>
                )}

                <div className="hero-release-links">
                  {links.map(({ key, label, Icon }) => (
                    <a
                      key={key}
                      className="hero-stream-link"
                      href={streaming[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
