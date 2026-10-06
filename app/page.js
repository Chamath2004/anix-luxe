"use client";
import { useMemo, useState } from "react";
import "./globals.css";
import ScrollRig from "../components/ScrollRig";
import { PRODUCTS } from "../lib/products";

const COLLECTIONS = [
  { brand: "casio", tag: "Vintage Icon", name: "Casio", copy: "A168WA, B640WD and AQ-230A. Retro rectangles, EL backlight, 50M resistance. 2-year warranty.", img: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=1200&auto=format&fit=crop", from: "From Rs 15,990" },
  { brand: "edifice", tag: "Racing Chronograph", name: "Edifice", copy: "Motorsport precision in steel. Chronograph layouts, 100M builds, night-legible dials.", img: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1200&auto=format&fit=crop", from: "Motorsport series" },
  { brand: "poedagar", tag: "Bestseller", name: "Poedagar", copy: "613, 615, 921, 928 and 930. Hardlex glass, luminous hands, hidden clasps. 1-year warranty.", img: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1200&auto=format&fit=crop", from: "From Rs 5,890" },
  { brand: "skmei", tag: "Urban Sport", name: "Skmei", copy: "Everyday digital and leather hybrids. High-contrast displays, comfort straps, honest pricing.", img: "https://images.unsplash.com/photo-1495856458515-0637185db551?q=80&w=1200&auto=format&fit=crop", from: "From Rs 4,490" },
  { brand: "automatic", tag: "Mechanical", name: "Automatic", copy: "Entry mechanicals with sweeping seconds and exhibition backs. Start a collection here.", img: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1200&auto=format&fit=crop", from: "From Rs 12,990" }
];

function Lines({ lines }) {
  return (<>{lines.map((l, i) => <span key={i} className="mask-line"><span>{l}</span></span>)}</>);
}

export default function Page() {
  const [brand, setBrand] = useState("all");
  const [sort, setSort] = useState("pop");
  const list = useMemo(() => {
    let l = PRODUCTS.filter((p) => brand === "all" || p.brand.toLowerCase() === brand);
    if (sort === "low") l = [...l].sort((a, b) => parseInt(a.price.replace(/\D/g, "")) - parseInt(b.price.replace(/\D/g, "")));
    if (sort === "high") l = [...l].sort((a, b) => parseInt(b.price.replace(/\D/g, "")) - parseInt(a.price.replace(/\D/g, "")));
    return l;
  }, [brand, sort]);

  return (
    <>
      <ScrollRig />
      <div className="progress" />
      <div className="util"><div className="wrap"><span>Complimentary islandwide delivery</span><span>1–2 year warranty · No hidden charges</span></div></div>
      <header className="site-header">
        <div className="wrap">
          <nav className="nav"><a href="#collections">Collections</a><a href="#shop">Watches</a><a href="#services">Services</a></nav>
          <a className="brand" href="#top">ANIX<small>HOUSE OF TIME</small></a>
          <div className="head-icons"><a href="https://anix.lk/product-category/watches/" target="_blank" rel="noreferrer">anix.lk →</a></div>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-sticky">
            <div className="watch-frame">
              <video className="watch-image watch-video" poster="/anix-luxe/hero-poster.jpg" muted playsInline preload="auto" disablePictureInPicture />
            </div>
            <div className="hero-top"><p className="eyebrow">The Watch Collections</p></div>
            <div className="hero-copy">
              <p className="eyebrow">ANIX · SRI LANKA</p>
              <h1>WATCHES, COMPOSED<br />LIKE A <em>MAISON</em></h1>
              <p>Disassembly in motion. Scroll — the frame pulls back, the maison opens.</p>
            </div>
          </div>
        </section>

        <section className="intro">
          <div className="wrap">
            <p className="eyebrow" data-fade>Maison / Watches / <b>Collections</b></p>
            <h1><Lines lines={["The Collections"]} /></h1>
            <p data-fade>Five universes under one roof — vintage digital to mechanical. Originals only, sealed boxes, Mintpay and Koko instalments. Real catalogue: anix.lk, 715 references.</p>
            <div className="toolbar wrap">
              <div className="pills">
                {[["all", "View all"], ["casio", "Casio"], ["edifice", "Edifice"], ["poedagar", "Poedagar"], ["skmei", "Skmei"], ["automatic", "Automatic"]].map(([v, l]) => (
                  <button key={v} className={brand === v ? "active" : ""} onClick={() => setBrand(v)}>{l}</button>
                ))}
              </div>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="pop">Sort: Featured</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </section>

        <section id="collections">
          {(brand === "all" ? COLLECTIONS : COLLECTIONS.filter((c) => c.brand === brand)).map((c) => (
            <article key={c.brand} className="crow">
              <div className="cimg ph"><img data-zoom data-parallax="6" src={c.img} alt={c.name} /></div>
              <div className="cbody">
                <small data-fade>{c.tag.toUpperCase()}</small>
                <h2><Lines lines={[c.name]} /></h2>
                <p data-fade>{c.copy}</p>
                <p data-fade style={{ fontSize: 12, letterSpacing: ".18em" }}>{c.from.toUpperCase()}</p>
                <a className="cta" href="#shop" onClick={() => setBrand(c.brand)}>Discover {c.name} →</a>
              </div>
            </article>
          ))}
        </section>

        <section id="shop" className="section">
          <div className="wrap">
            <p className="eyebrow" data-fade>The Selection · {list.length} models</p>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(36px,4.6vw,64px)", fontWeight: 400 }}><Lines lines={["Icons of the maison"]} /></h2>
            <div className="grid" style={{ marginTop: 28 }}>
              {list.map((p) => (
                <article key={p.id} className="p-card">
                  <div className="im">
                    {p.tag && <span className="badge">{p.tag}</span>}
                    <img loading="lazy" src={p.img} alt={p.name} />
                    <button className="quick-add">Add to Bag +</button>
                  </div>
                  <div className="p-body"><small>{p.brand}</small><h3>{p.name}</h3>
                    <span className="spec">{p.spec} · 1–2 yr warranty</span>
                    <div className="price"><strong>{p.price}</strong>{p.old && <s>{p.old}</s>}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="svc">
          <div className="wrap">
            <div><h3>100% Original</h3><p>Sealed brand boxes. What you see is what ships.</p></div>
            <div><h3>1–2 Year Warranty</h3><p>Poedagar / Skmei 1 yr · Casio / Edifice 2 yrs.</p></div>
            <div><h3>Pay Your Way</h3><p>COD islandwide, cards, Mintpay 3×, Koko 3×.</p></div>
            <div><h3>Human Support</h3><p>Sizing guidance before you buy, via contact page.</p></div>
          </div>
        </section>

        <footer><div className="wrap"><span>© 2026 ANIX concept — original design, Cartier-inspired layout only</span><span><a href="https://anix.lk/product-category/watches/" target="_blank" rel="noreferrer">anix.lk/product-category/watches →</a></span></div></footer>
      </main>
    </>
  );
}
