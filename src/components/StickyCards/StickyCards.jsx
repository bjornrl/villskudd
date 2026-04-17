"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./StickyCards.css";

gsap.registerPlugin(ScrollTrigger);

const MOBILE_BREAKPOINT = 1000;

// REVIEW: placeholder copy — we'll rewrite these cards together. Titles and text
// are still somewhat restaurant-flavored but generic enough to survive a first pass.
const CARDS = [
  {
    title: "Flyttevisa",
    description:
      "Every song is shaped with intention, letting instinct and discipline meet in the middle.",
    image: "/villskudd/634739398_906048972150569_2400757593125008047_n.jpg",
  },
  {
    title: "Tåre bak øret",
    description:
      "What started as four friends and a shed rehearsal became a band with something to say.",
    image: "/villskudd/650749186_929117529843713_7811746886751597834_n.jpg",
  },
  {
    title: "Vår lille hemmelighet",
    description:
      "An atmosphere of light, sweat, and stillness — a set that leaves a mark long after the last chord.",
    image: "/villskudd/659868390_948510587904407_2580548867163660943_n.jpg",
  },
  {
    title: "Varden",
    description:
      "Guitars, drums, and honest songwriting. Nothing polished to a mirror finish.",
    image: "/villskudd/663230265_948521347903331_2152816629037131895_n.jpg",
  },
  {
    title: "Mytologier",
    description:
      "Jeg sovna med en bok over ansiktet, og da jeg våkna var blekket rent ut. Inn i munnen mellom øya og øya, jeg skulle lese på min gåsehud. Orda var som en drukken fant som hadde flytta inn i meg. Når regnet starter, da går jeg min vei. ",
    image: "/villskudd/665943064_950927144329418_6267409270449355377_n.jpg",
  },
  {
    title: "Flere ideer",
    description:
      "Jeg sa til min neste, jeg sa nå er vi kurert. Og hvis du har flere ideer så er jeg interessert.",
    image: "/villskudd/667382604_950927154329417_5784654158304383852_n.jpg",
  },
];

const StickyCards = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx;
    const section = sectionRef.current;

    const buildScrollAnimation = () => {
      if (ctx) ctx.revert();

      const cardElements = section.querySelectorAll(".sticky-card");
      cardElements.forEach((card) => gsap.set(card, { clearProps: "all" }));

      if (window.innerWidth < MOBILE_BREAKPOINT) {
        section.classList.add("sticky-cards-mobile");
        return;
      }

      section.classList.remove("sticky-cards-mobile");

      requestAnimationFrame(() => {
        ctx = gsap.context(() => {
          const cards = gsap.utils.toArray(".sticky-card");
          const totalCards = cards.length;

          const lastLeftColumnIndex =
            totalCards % 2 === 0 ? totalCards - 2 : totalCards - 1;
          const lastRightColumnIndex =
            totalCards % 2 === 0 ? totalCards - 1 : totalCards - 2;

          cards.forEach((card, index) => {
            const isLastInColumn =
              index === lastLeftColumnIndex || index === lastRightColumnIndex;
            if (isLastInColumn) return;

            gsap
              .timeline({
                scrollTrigger: {
                  trigger: card,
                  start: "bottom top",
                  end: "+=100%",
                  scrub: true,
                },
              })
              .to(card, {
                yPercent: -100,
                ease: "none",
              });
          });

          ScrollTrigger.refresh();
        }, sectionRef);
      });
    };

    let wasMobile = window.innerWidth < MOBILE_BREAKPOINT;
    buildScrollAnimation();

    const handleResize = () => {
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      if (isMobile !== wasMobile) {
        wasMobile = isMobile;
        buildScrollAnimation();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <div className="sticky-cards" ref={sectionRef}>
      {CARDS.map((card, index) => (
        <div className="sticky-card" key={index}>
          <div className="sticky-card-img">
            <img src={card.image} alt={card.title} />
          </div>
          <h3>{card.title}</h3>
          <p>{card.description}</p>
        </div>
      ))}
    </div>
  );
};

export default StickyCards;
