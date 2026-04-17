"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Preloader, { isInitialLoad } from "@/components/Preloader/Preloader";
import Copy from "@/components/Copy/Copy";
import Shop from "@/components/Shop/Shop";
import Concerts from "@/components/Concerts/Concerts";
import CTA from "@/components/CTA/CTA";
import ImageBanner from "@/components/ImageBanner/ImageBanner";

import "./home.css";

gsap.registerPlugin(ScrollTrigger);

// REVIEW: using villskudd band photos (4). Add more to /public/home/ named villskudd_5.jpg, villskudd_6.jpg to fill out the scroll-scaling gallery to 6.
const ABOUT_IMAGES = [
  "/villskudd_1.jpg",
  "/villskudd_2.jpeg",
  "/villskudd_3.webp",
  "/villskudd_4.jpg",
];

export default function Home() {
  const aboutSectionRef = useRef(null);
  const isInitialPageLoad = useRef(isInitialLoad).current;
  const [preloaderDelay, setPreloaderDelay] = useState(
    isInitialPageLoad ? 9999 : 0,
  );

  const handlePreloaderEnter = () => {
    if (isInitialPageLoad) setPreloaderDelay(0.2);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const aboutImages = gsap.utils.toArray(".about-img");

      /* scale each about image in and out as it scrolls through the viewport */
      aboutImages.forEach((image) => {
        const imageScaleTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: image,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        imageScaleTimeline
          .fromTo(image, { scale: 0.5 }, { scale: 1.25, ease: "none" })
          .to(image, { scale: 0.5, ease: "none" });
      });

      /* fade out the about header as the image gallery scrolls away */
      gsap.to(".about-header h3", {
        opacity: 0,
        ease: "power1.out",
        scrollTrigger: {
          trigger: ".about-imgs",
          start: "bottom bottom",
          end: "bottom 30%",
          scrub: true,
        },
      });
    }, aboutSectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Preloader onEnter={handlePreloaderEnter} />

      <section className="hero">
        <div className="hero-img">
          {/* REVIEW: swap for a hero-quality band shot */}
          <img src="/villskudd_1.jpg" alt="" />
        </div>

        <div className="container">
          <Copy
            type="words"
            animateOnScroll={false}
            delay={isInitialPageLoad ? preloaderDelay : 0.85}
          >
            <h1>Villskudd</h1>
          </Copy>

          <div className="section-footer">
            <Copy
              type="lines"
              animateOnScroll={false}
              delay={isInitialPageLoad ? preloaderDelay + 0.15 : 1.1}
            >
              {/* REVIEW: swap for real founding year */}
              <p className="sm">Since 2020</p>
            </Copy>
            <Copy
              type="lines"
              animateOnScroll={false}
              delay={isInitialPageLoad ? preloaderDelay + 0.25 : 1.2}
            >
              {/* REVIEW: confirm hometown */}
              <p className="sm">Oslo, NO</p>
            </Copy>
          </div>
        </div>
      </section>

      <section className="about" ref={aboutSectionRef} style={{ backgroundColor: "red" }}>
        <div className="about-header">
          <div className="container">
            <Copy type="lines">
              {/* REVIEW: replace with real band bio line */}
              <h3>
              Villskudd er et band. Et rått og livsbejaende band, som spiller norsk rock i den moderne virkelighet.
              </h3>
            </Copy>

            <div className="section-footer">
              {/* REVIEW: tagline words */}
              <Copy type="lines" trigger=".about" start="top 50%" delay={0.5}>
                <p className="sm">Norsk Rock</p>
              </Copy>
              <Copy type="lines" trigger=".about" start="top 50%" delay={0.6}>
                <p className="sm">Live & Loud</p>
              </Copy>
            </div>
          </div>
        </div>

        <div className="about-imgs">
          <div className="container">
            {ABOUT_IMAGES.map((src, index) => (
              <div
                key={index + 1}
                className="about-img"
                id={`about-img-${index + 1}`}
              >
                <img src={src} alt="" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <Concerts />
      <Shop />
      
      {/* <CTA /> */}
      <ImageBanner />
    </>
  );
}
