"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { HiMenu, HiX } from "react-icons/hi";

import { useViewTransition } from "@/hooks/useViewTransition";

import "./Nav.css";

// In-page anchors — clicking scrolls to the matching section on the home page.
// Labels default here but can be overridden from Sanity (navLabels).
const NAV_LINKS_BASE = [
  {
    key: "shows",
    label: "Konserter",
    target: "#shows",
    img: "/villskudd/575123461_828732663215534_2468220249039237006_n.jpg",
  },
  {
    key: "shop",
    label: "Shop",
    target: "#shop",
    img: "/villskudd/585751616_842519421836858_7276661789111941255_n.jpg",
  },
  {
    key: "contact",
    label: "Kontakt",
    target: "#contact",
    img: "/villskudd/631825477_906049315483868_8478062725345646312_n.jpg",
  },
];

const FALLBACK_SOCIALS = [
  { label: "Spotify", href: "https://open.spotify.com/artist/5FCkBVSFSwy86a5t5iVwha" },
  { label: "Instagram", href: "#" },
  { label: "Email", href: "mailto:villskuddband@gmail.com" },
];

const LINK_TEXT_SELECTORS = [".nav-link a", ".nav-social a"];
const FOOTER_TEXT_SELECTORS = [".nav-menu-footer p span"];
const ALL_TEXT_SELECTORS = [...LINK_TEXT_SELECTORS, ...FOOTER_TEXT_SELECTORS];

export default function Nav({ pageRef, navSettings }) {
  const pathname = usePathname();
  const lenis = useLenis();
  const { navigateWithTransition } = useViewTransition();

  const navLabels = navSettings?.navLabels || {};
  const NAV_LINKS = NAV_LINKS_BASE.map((link) => ({
    ...link,
    label: navLabels[link.key] || link.label,
  }));
  const SOCIAL_LINKS =
    navSettings?.socials?.length > 0 ? navSettings.socials : FALLBACK_SOCIALS;
  const footerLeft = navSettings?.navFooter?.left || "Since 2020";
  const footerRight = navSettings?.navFooter?.right || "Oslo, NO";

  const lenisInstanceRef = useRef(null);
  const isMenuOpenRef = useRef(false);
  const isMenuAnimatingRef = useRef(false);
  const previewImageRef = useRef(null);

  useEffect(() => {
    lenisInstanceRef.current = lenis;
  }, [lenis]);

  useEffect(() => {
    if (isMenuOpenRef.current) forceCloseMenu();
  }, [pathname]);

  function lockScroll() {
    if (lenisInstanceRef.current) lenisInstanceRef.current.stop();
    document.body.style.overflow = "hidden";
  }

  function unlockScroll() {
    document.body.style.overflow = "";
    if (lenisInstanceRef.current) lenisInstanceRef.current.start();
  }

  function prunePreviewImages() {
    const container = previewImageRef.current;
    if (!container) return;
    const images = container.querySelectorAll("img");
    if (images.length > 3) {
      for (let i = 0; i < images.length - 3; i++) {
        container.removeChild(images[i]);
      }
    }
  }

  function resetPreviewImage() {
    const container = previewImageRef.current;
    if (!container) return;
    container.innerHTML = "";
    const defaultImg = document.createElement("img");
    defaultImg.src = NAV_LINKS[0].img;
    container.appendChild(defaultImg);
  }

  function killMenuTextTweens() {
    gsap.killTweensOf(ALL_TEXT_SELECTORS);
  }

  function resetMenuTextToHidden() {
    gsap.set(LINK_TEXT_SELECTORS, { y: "140%", opacity: 0.25 });
    gsap.set(FOOTER_TEXT_SELECTORS, { y: "120%", opacity: 0.25 });
  }

  function animateToggleLabel(isOpening) {
    const openLabel = document.querySelector("#nav-toggle-open");
    const closeLabel = document.querySelector("#nav-toggle-close");

    gsap.to(isOpening ? openLabel : closeLabel, {
      x: -5,
      y: isOpening ? -10 : 10,
      rotation: isOpening ? -5 : 5,
      opacity: 0,
      delay: 0.25,
      duration: 0.5,
      ease: "power2.out",
    });

    gsap.to(isOpening ? closeLabel : openLabel, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      delay: 0.5,
      duration: 0.5,
      ease: "power2.out",
    });
  }

  function openMenu() {
    if (isMenuAnimatingRef.current || isMenuOpenRef.current) return;
    isMenuAnimatingRef.current = true;

    const page = pageRef?.current;
    const scrollY = window.scrollY;

    lockScroll();

    if (page) {
      page.style.transformOrigin = `right ${scrollY}px`;

      gsap.to(page, {
        rotation: 10,
        x: 300,
        y: 450,
        scale: 1.5,
        duration: 1.25,
        ease: "power4.inOut",
      });
    }

    animateToggleLabel(true);
    killMenuTextTweens();
    resetMenuTextToHidden();

    gsap.to(".nav-menu-content", {
      rotation: 0,
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 1.25,
      ease: "power4.inOut",
    });

    gsap.to(ALL_TEXT_SELECTORS, {
      y: "0%",
      opacity: 1,
      delay: 0.75,
      duration: 1,
      ease: "power3.out",
      stagger: 0.1,
    });

    gsap.to(".nav-menu-overlay", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 175%, 0% 100%)",
      duration: 1.25,
      ease: "power4.inOut",
      onComplete: () => {
        isMenuOpenRef.current = true;
        isMenuAnimatingRef.current = false;
      },
    });
  }

  function closeMenu() {
    if (isMenuAnimatingRef.current || !isMenuOpenRef.current) return;
    isMenuAnimatingRef.current = true;

    const page = pageRef?.current;

    if (page) {
      gsap.to(page, {
        rotation: 0,
        x: 0,
        y: 0,
        scale: 1,
        duration: 1.25,
        ease: "power4.inOut",
        onComplete: () => {
          gsap.set(page, { clearProps: "all" });
          page.style.transformOrigin = "";
        },
      });
    }

    animateToggleLabel(false);
    killMenuTextTweens();

    gsap.to(".nav-menu-content", {
      rotation: -15,
      x: -100,
      y: -100,
      scale: 1.5,
      opacity: 0.25,
      duration: 1.25,
      ease: "power4.inOut",
    });

    gsap.to(".nav-menu-overlay", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1.25,
      ease: "power4.inOut",
      onComplete: () => {
        isMenuOpenRef.current = false;
        isMenuAnimatingRef.current = false;
        resetMenuTextToHidden();
        resetPreviewImage();
        unlockScroll();
      },
    });
  }

  function forceCloseMenu() {
    const page = pageRef?.current;
    if (page) {
      gsap.set(page, { clearProps: "all" });
      page.style.transformOrigin = "";
    }

    killMenuTextTweens();

    gsap.set(".nav-menu-overlay", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    });
    gsap.set(".nav-menu-content", {
      rotation: -15,
      x: -100,
      y: -100,
      scale: 1.5,
      opacity: 0.25,
    });

    resetMenuTextToHidden();

    gsap.set("#nav-toggle-open", { x: 0, y: 0, rotation: 0, opacity: 1 });
    gsap.set("#nav-toggle-close", { x: -5, y: 10, rotation: 5, opacity: 0 });

    isMenuOpenRef.current = false;
    isMenuAnimatingRef.current = false;
    resetPreviewImage();
    unlockScroll();
  }

  function handleToggle() {
    if (!isMenuOpenRef.current) openMenu();
    else closeMenu();
  }

  function handleNavClick(e, target) {
    e.preventDefault();

    const el = document.querySelector(target);

    // not on the home page (section absent) — route home with the hash
    if (!el) {
      navigateWithTransition(`/${target}`);
      return;
    }

    // jump the underlying page to the section, then reveal it by closing the menu
    lenisInstanceRef.current?.scrollTo(el, { immediate: true, force: true });
    closeMenu();
  }

  function handleLinkHover(imageSrc) {
    if (!isMenuOpenRef.current || isMenuAnimatingRef.current) return;
    const container = previewImageRef.current;
    if (!container || !imageSrc) return;

    const currentImages = container.querySelectorAll("img");
    if (
      currentImages.length > 0 &&
      currentImages[currentImages.length - 1].src.endsWith(imageSrc)
    )
      return;

    const newImg = document.createElement("img");
    newImg.src = imageSrc;
    newImg.style.opacity = "0";
    newImg.style.transform = "scale(1.25) rotate(10deg)";
    container.appendChild(newImg);
    prunePreviewImages();

    gsap.to(newImg, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.75,
      ease: "power2.out",
    });
  }

  return (
    <>
      <nav className="nav-bar">
        <div className="nav-toggle" onClick={handleToggle} aria-label="Meny">
          <span id="nav-toggle-open">
            <HiMenu />
          </span>
          <span id="nav-toggle-close">
            <HiX />
          </span>
        </div>
      </nav>

      <div className="nav-menu-overlay">
        <div className="nav-menu-content">
          <div className="nav-menu-items">
            <div className="nav-col-lg">
              <div className="nav-preview-img" ref={previewImageRef}>
                <img src={NAV_LINKS[0].img} alt="" />
              </div>
            </div>

            <div className="nav-col-sm">
              <div className="nav-menu-links">
                {NAV_LINKS.map((link) => (
                  <div className="nav-link" key={link.label}>
                    <a
                      href={link.target}
                      data-img={link.img}
                      onMouseOver={() => handleLinkHover(link.img)}
                      onClick={(e) => handleNavClick(e, link.target)}
                    >
                      {link.label}
                    </a>
                  </div>
                ))}
              </div>

              <div className="nav-menu-socials">
                {SOCIAL_LINKS.map((social) => (
                  <div className="nav-social" key={social.label}>
                    <a href={social.href}>{social.label}</a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="nav-menu-footer">
            <p className="sm">
              <span>{footerLeft}</span>
            </p>
            <p className="sm">
              <span>{footerRight}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
