"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Copy from "@/components/Copy/Copy";
import Newsletter from "@/components/Newsletter/Newsletter";

import "./Footer.css";

gsap.registerPlugin(ScrollTrigger);

const MOBILE_BREAKPOINT = 1000;

const POSTCARDS = [
  {
    image: "/villskudd/669292333_950927080996091_4504162377709105613_n.jpg",
    rotation: -8,
    x: "-25%",
  },
  {
    image: "/villskudd/671869304_956443863777746_5378642915469791746_n.jpg",
    rotation: 6,
    x: "20%",
  },
  {
    image: "/villskudd/671872491_956444143777718_5238889023699089133_n.jpg",
    rotation: -4,
    x: "-15%",
  },
  {
    image: "/villskudd/672687549_956444010444398_132729007994355477_n.jpg",
    rotation: 10,
    x: "25%",
  },
  {
    image: "/villskudd/673267438_956444273777705_5520357671097795416_n.jpg",
    rotation: -12,
    x: "-10%",
  },
];

const Footer = () => {
  const pathname = usePathname();
  const sectionRef = useRef(null);
  const visitButtonRef = useRef(null);
  const visitButtonContainerRef = useRef(null);

  /* button scroll-triggered entrance, re-runs on route change */
  useEffect(() => {
    const heading = sectionRef.current?.querySelector(".footer-heading");
    const buttonContainer = visitButtonContainerRef.current;
    if (!heading || !buttonContainer) return;

    gsap.set(buttonContainer, { autoAlpha: 0, y: 40 });

    const scrollTrigger = ScrollTrigger.create({
      trigger: heading,
      start: "top 50%",
      once: true,
      onEnter: () => {
        gsap.to(buttonContainer, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
        });
      },
    });

    return () => scrollTrigger.kill();
  }, [pathname]);

  /* postcard hover effect (desktop only) */
  useEffect(() => {
    const section = sectionRef.current;
    const button = visitButtonRef.current;
    if (!section || !button) return;

    const cards = gsap.utils.toArray(".footer-postcard");
    const postcardsContainer = section.querySelector(".footer-postcards");
    if (!cards.length || !postcardsContainer) return;

    const postcardTimeline = gsap.timeline({ paused: true });

    cards.forEach((card, index) => {
      const cardData = POSTCARDS[index];
      postcardTimeline.fromTo(
        card,
        { yPercent: 250, xPercent: 0, rotation: 0 },
        {
          yPercent: 55,
          xPercent: parseFloat(cardData.x),
          rotation: cardData.rotation,
          duration: 0.8,
          ease: "power3.out",
        },
        index * 0.07,
      );
    });

    const handleMouseEnter = () => postcardTimeline.play();
    const handleMouseLeave = () => postcardTimeline.reverse();

    let isHoverActive = false;

    const enableHover = () => {
      if (isHoverActive) return;
      button.addEventListener("mouseenter", handleMouseEnter);
      button.addEventListener("mouseleave", handleMouseLeave);
      postcardsContainer.style.display = "";
      isHoverActive = true;
    };

    const disableHover = () => {
      if (!isHoverActive) return;
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
      postcardTimeline.pause(0);
      postcardsContainer.style.display = "none";
      isHoverActive = false;
    };

    const handleResize = () => {
      window.innerWidth < MOBILE_BREAKPOINT ? disableHover() : enableHover();
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      disableHover();
      window.removeEventListener("resize", handleResize);
    };
  }, [pathname]);

  return (
    <footer className="footer" ref={sectionRef}>
      <div className="footer-content">
        <div className="footer-heading">
          <Copy key={`heading-${pathname}`} type="lines" animateOnScroll>
            <h2>Bli med på tur</h2>
          </Copy>
        </div>

        <div className="footer-button-container" ref={visitButtonContainerRef}>
          <Newsletter ref={visitButtonRef} />
        </div>
      </div>

      <div className="footer-postcards">
        {POSTCARDS.map((card, index) => (
          <div className="footer-postcard" key={index}>
            <img src={card.image} alt="Villskudd" />
          </div>
        ))}
      </div>

      <div className="footer-bar">
        <div className="footer-bar-left">
          <Copy
            key={`left-${pathname}`}
            type="lines"
            trigger=".footer-heading"
            animateOnScroll
          >
            <p className="sm">&copy;2026 Villskudd</p>
          </Copy>
        </div>
        <div className="footer-bar-right">
          <Copy
            key={`right-${pathname}`}
            type="lines"
            trigger=".footer-heading"
            animateOnScroll
          >
            <p className="sm">villskuddband@gmail.com</p>
          </Copy>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
