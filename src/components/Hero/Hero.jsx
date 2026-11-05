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

const YOUTUBE_HOSTS = new Set([
  "youtu.be",
  "youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
]);

function toYouTubeEmbed(url) {
  if (!url || typeof url !== "string") return null;

  let parsed;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "");
  if (!YOUTUBE_HOSTS.has(host)) return null;

  let id = null;
  if (host === "youtu.be") {
    id = parsed.pathname.split("/").filter(Boolean)[0];
  } else if (parsed.pathname === "/watch") {
    id = parsed.searchParams.get("v");
  } else {
    const parts = parsed.pathname.split("/").filter(Boolean);
    const markerIndex = parts.findIndex((part) =>
      ["embed", "shorts", "live", "v"].includes(part),
    );
    if (markerIndex >= 0) id = parts[markerIndex + 1];
  }

  if (!id || !/^[\w-]{11}$/.test(id)) return null;

  const params = new URLSearchParams({ rel: "0" });
  const start = parsed.searchParams.get("start") || parsed.searchParams.get("t");
  if (start && /^\d+$/.test(start.replace(/s$/, ""))) {
    params.set("start", start.replace(/s$/, ""));
  }

  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export default function Hero({ release, settings }) {
  const isInitialPageLoad = useRef(isInitialLoad).current;
  const [preloaderDelay, setPreloaderDelay] = useState(
    isInitialPageLoad ? 9999 : 0,
  );
  // Keep the YouTube player out of the DOM until the intro is gone. On
  // mobile, an iframe composites above position:fixed, so mounting it
  // during the preloader hides the dog and the Trykk da button.
  const [showVideo, setShowVideo] = useState(!isInitialPageLoad);

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
  const videoEmbed = toYouTubeEmbed(settings?.videoUrl);

  return (
    <>
      <Preloader
        onEnter={handlePreloaderEnter}
        onAnimationComplete={() => setShowVideo(true)}
        buttonText={settings?.enterLabel || "Trykk da"}
      />

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

            {videoEmbed && showVideo && (
              <div className="hero-video">
                <iframe
                  src={videoEmbed}
                  title="YouTube-video"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
