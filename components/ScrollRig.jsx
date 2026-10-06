"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollRig() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    let rafId;
    const raf = (t) => { lenis.raf(t); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      gsap.to(".progress", {
        scaleX: 1, ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.4 }
      });

      // HERO macro pull-back — one scrubbed timeline drives everything
      // scroll 0% huge macro → 25% zoom out → 50% frame shrinks+rounds → 100% small + text
      // Hero video: ambient autoplay (playable), pause off-screen for perf.
      // Scroll still drives frame size / copy via the timeline below — not currentTime,
      // because scrub-seeking 1080p freezes playback.
      const video = document.querySelector(".watch-video");
      if (video) {
        video.muted = true;
        const tryPlay = () => video.play().catch(() => {});
        video.addEventListener("canplay", tryPlay, { once: true });
        tryPlay();
        ScrollTrigger.create({
          trigger: ".hero", start: "top bottom", end: "bottom top",
          onEnter: tryPlay, onEnterBack: tryPlay,
          onLeave: () => video.pause(), onLeaveBack: () => video.pause()
        });
      }
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom bottom", scrub: 1 }
      });
      tl.fromTo(".watch-image", { scale: 1.08 }, { scale: 1, ease: "none" }, 0)
        .to(".watch-frame",
          { width: "34vw", height: "42vh", borderRadius: "90px", ease: "none" }, 0)
        .fromTo(".hero-copy", { y: 80, opacity: 0 }, { y: 0, opacity: 1, ease: "none" }, 0.45)
        .fromTo(".hero-top", { opacity: 1, y: 0 }, { opacity: 0, y: -40, ease: "none" }, 0.25)
        .to(".watch-frame",
          { width: "11vw", height: "18vh", borderRadius: "100px", y: "-14vh", ease: "none" }, 0.65);

      // Text line masks
      gsap.utils.toArray(".mask-line > span").forEach((s) => {
        gsap.fromTo(s, { yPercent: 110 }, {
          yPercent: 0, duration: 1.4, ease: "power4.out",
          scrollTrigger: { trigger: s, start: "top 88%" }
        });
      });
      gsap.utils.toArray("[data-fade]").forEach((el) => {
        gsap.fromTo(el, { y: 28, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" }
        });
      });

      // Image reveals through masks
      gsap.utils.toArray(".ph").forEach((ph) => {
        const img = ph.querySelector("img");
        const t2 = gsap.timeline({ scrollTrigger: { trigger: ph, start: "top 85%" } });
        t2.fromTo(ph,
          { clipPath: "inset(12% 8% 12% 8% round 20px)", opacity: 0.4 },
          { clipPath: "inset(0% 0% 0% 0% round 20px)", opacity: 1, duration: 1.5, ease: "power4.out" }, 0)
          .fromTo(img, { scale: 1.25 }, { scale: 1.08, duration: 1.6, ease: "power4.out" }, 0);
      });

      gsap.utils.toArray("[data-zoom]").forEach((img) => {
        gsap.fromTo(img, { scale: 1.14 }, {
          scale: 1.0, ease: "none",
          scrollTrigger: { trigger: img.closest("section") || img, start: "top bottom", end: "bottom top", scrub: true }
        });
      });

      gsap.utils.toArray("[data-parallax]").forEach((img) => {
        const amt = parseFloat(img.dataset.parallax || "10");
        gsap.fromTo(img, { yPercent: -amt }, {
          yPercent: amt, ease: "none",
          scrollTrigger: { trigger: img.closest(".ph") || img, start: "top bottom", end: "bottom top", scrub: true }
        });
      });

      gsap.utils.toArray(".pin-img img").forEach((img) => {
        gsap.fromTo(img, { yPercent: -8, scale: 1.12 }, {
          yPercent: 8, scale: 1.0, ease: "none",
          scrollTrigger: { trigger: ".pinned", start: "top top", end: "bottom bottom", scrub: true }
        });
      });

      ScrollTrigger.batch(".p-card", {
        start: "top 90%",
        onEnter: (els) => gsap.fromTo(els,
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, ease: "power3.out", stagger: 0.08, overwrite: true })
      });
      gsap.set(".p-card", { opacity: 0 });
    });

    return () => { ctx.revert(); cancelAnimationFrame(rafId); lenis.destroy(); };
  }, []);

  return null;
}
