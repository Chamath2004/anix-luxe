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

    let cleanupVideo = () => {};
    const ctx = gsap.context(() => {
      gsap.to(".progress", {
        scaleX: 1, ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.4 }
      });

      // HERO macro pull-back — one scrubbed timeline drives everything
      // scroll 0–70% full-bleed while the watch opens and reassembles (video 0–6s),
      // 70–96% frame shrinks+rounds as the video pulls back, copy fades in
      // Hero video: scroll-scrubbed. hero-scrub*.mp4 are encoded all-keyframe (-g 1) so every
      // seek is instant, and loaded as a blob so seeks never wait on the network.
      // The ticker eases currentTime toward the scroll position instead of jumping to it.
      const video = document.querySelector(".watch-video");
      if (video) {
        video.muted = true;
        let target = 0, alive = true, blobUrl;
        const small = window.matchMedia("(max-width: 640px)").matches;
        fetch(`/anix-luxe/hero-scrub${small ? "-720" : ""}.mp4`)
          .then((r) => r.blob())
          .then((b) => {
            if (!alive) return;
            blobUrl = URL.createObjectURL(b);
            video.src = blobUrl;
            // iOS only paints seeked frames after the element has played once
            video.addEventListener("loadedmetadata", () => {
              const p = video.play();
              if (p) p.then(() => video.pause()).catch(() => {});
            }, { once: true });
          })
          .catch(() => {});
        ScrollTrigger.create({
          // from the very top of the page, so the first pixels of scroll already move the video
          start: 0, endTrigger: ".hero", end: "bottom bottom",
          onUpdate: (self) => { target = self.progress; }
        });
        const tick = () => {
          const d = video.duration;
          if (!d || video.readyState < 2 || video.seeking) return;
          const diff = target * (d - 0.05) - video.currentTime;
          if (Math.abs(diff) < 0.005) return;
          video.currentTime += Math.abs(diff) < 0.03 ? diff : diff * 0.25;
        };
        gsap.ticker.add(tick);
        cleanupVideo = () => {
          alive = false;
          gsap.ticker.remove(tick);
          if (blobUrl) URL.revokeObjectURL(blobUrl);
        };
      }
      const mm = gsap.matchMedia();
      mm.add("(max-width: 1000px)", () => {
        const m = gsap.timeline({
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom bottom", scrub: 1 }
        });
        m.fromTo(".watch-image", { scale: 1.08 }, { scale: 1, duration: 1, ease: "none" }, 0)
          .fromTo(".hero-top", { opacity: 1, y: 0 }, { opacity: 0, y: -30, duration: 0.1, ease: "none" }, 0.04)
          .to(".watch-frame",
            { width: "80vw", height: "44vh", borderRadius: "36px", duration: 0.14, ease: "none" }, 0.7)
          .fromTo(".hero-copy", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.14, ease: "none" }, 0.8)
          .to(".watch-frame",
            { width: "52vw", height: "30vh", borderRadius: "60px", y: "-10vh", duration: 0.12, ease: "none" }, 0.84);
      });
      mm.add("(min-width: 1001px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom bottom", scrub: 1 }
      });
      tl.fromTo(".watch-image", { scale: 1.08 }, { scale: 1, duration: 1, ease: "none" }, 0)
        .fromTo(".hero-top", { opacity: 1, y: 0 }, { opacity: 0, y: -40, duration: 0.1, ease: "none" }, 0.04)
        .to(".watch-frame",
          { width: "34vw", height: "42vh", borderRadius: "90px", duration: 0.14, ease: "none" }, 0.7)
        .fromTo(".hero-copy", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.14, ease: "none" }, 0.8)
        .to(".watch-frame",
          { width: "11vw", height: "18vh", borderRadius: "100px", y: "-14vh", duration: 0.12, ease: "none" }, 0.84);
      });

      // Text line masks
      gsap.utils.toArray(".mask-line > span").forEach((s) => {
        // y: 0 clears the px offset GSAP reads from the CSS translateY(110%), else the line stays hidden
        gsap.fromTo(s, { yPercent: 110, y: 0 }, {
          yPercent: 0, y: 0, duration: 1.4, ease: "power4.out",
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

    return () => { cleanupVideo(); ctx.revert(); cancelAnimationFrame(rafId); lenis.destroy(); };
  }, []);

  return null;
}
