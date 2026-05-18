import { useEffect, useRef } from "react";
import { loadGSAP } from "../helpers";
import { useCounter } from "../hooks/useAnimations";

export default function Hero({ onShop, onFilterCategory }) {
  const badgeRef = useRef(null);
  const word1 = useRef(null), word2 = useRef(null), word3 = useRef(null), word4 = useRef(null), word5 = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const blobRef = useRef(null);
  const float1Ref = useRef(null);
  const float2Ref = useRef(null);
  const bgRef = useRef(null);
  const stat1 = useRef(null), stat2 = useRef(null), stat3 = useRef(null);
  useCounter(stat1, 50);
  useCounter(stat2, 10000);
  useCounter(stat3, 100);

  useEffect(() => {
    loadGSAP().then(() => {
      const gsap = window.gsap;
      const tl = gsap.timeline({ delay: 2.2 });
      tl.to(badgeRef.current, { opacity: 1, y: 0, duration: .6, ease: "back.out(1.5)" })
        .to([word1.current, word2.current, word3.current, word4.current, word5.current], { y: "0%", duration: .9, stagger: .08, ease: "power4.out" }, "-=.4")
        .to(descRef.current, { opacity: 1, y: 0, duration: .6 }, "-=.3")
        .to(ctaRef.current, { opacity: 1, y: 0, duration: .6 }, "-=.4")
        .to(statsRef.current, { opacity: 1, y: 0, duration: .6 }, "-=.3")
        .to(blobRef.current, { scale: 1, duration: 1.0, ease: "back.out(1.2)" }, "-=.8")
        .to([float1Ref.current, float2Ref.current], { opacity: 1, y: 0, duration: .6, stagger: .2, ease: "back.out(1.5)" }, "-=.6");

      // Parallax mouse
      const onMove = (e) => {
        const rx = (e.clientX / window.innerWidth - .5) * 12;
        const ry = (e.clientY / window.innerHeight - .5) * 8;
        gsap.to(float1Ref.current, { x: rx * .6, y: ry * .4, duration: .8, ease: "power2.out" });
        gsap.to(float2Ref.current, { x: rx * 1.2, y: ry * .8, duration: .8, ease: "power2.out" });
        gsap.to(bgRef.current, { x: rx * 3, duration: 1.2, ease: "power2.out" });
      };
      window.addEventListener("mousemove", onMove);
      return () => window.removeEventListener("mousemove", onMove);
    });
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero-left">
        <div className="hero-badge" ref={badgeRef}><span>100% Natural Ingredients</span></div>
        <h1 className="hero-title">
          <span className="line"><span className="word" ref={word1}>Nature's</span></span>
          <span className="line"><span className="word" ref={word2}><em>Finest</em></span>&nbsp;<span className="word" ref={word3}>Care</span></span>
          <span className="line"><span className="word" ref={word4}>For</span>&nbsp;<span className="word" ref={word5}>You</span></span>
        </h1>
        <p className="hero-desc" ref={descRef}>Discover the power of pure botanical ingredients. Our formulas are crafted to nourish, heal, and illuminate your hair &amp; skin naturally.</p>
        <div className="hero-cta-row" ref={ctaRef}>
          <button className="btn-primary" onClick={onShop}>
            Shop Now
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
          </button>
          <button className="btn-secondary" onClick={() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })}>Explore Collections</button>
        </div>
        <div className="hero-stats" ref={statsRef}>
          <div className="stat-item">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span className="stat-num" ref={stat1}>0</span>
              <span className="stat-suffix">+</span>
            </div>
            <span className="stat-label">Products</span>
          </div>
          <div className="stat-div" />
          <div className="stat-item">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span className="stat-num" ref={stat2}>0</span>
              <span className="stat-suffix">+</span>
            </div>
            <span className="stat-label">Happy Customers</span>
          </div>
          <div className="stat-div" />
          <div className="stat-item">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span className="stat-num" ref={stat3}>0</span>
              <span className="stat-suffix">%</span>
            </div>
            <span className="stat-label">Natural</span>
          </div>
        </div>
        <div className="hero-bg-text" ref={bgRef}>DSA Naturals</div>
      </div>
      <div className="hero-right">
        <div className="hero-img-wrap">
          <div className="hero-img-blob" ref={blobRef}>
            <img src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80" alt="Natural skincare" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
          </div>
        </div>
        <div className="hero-float hero-float-1" ref={float1Ref}>
          <div className="f-title">Best Seller</div>
          <div className="f-val">Argan Oil</div>
          <div className="f-sub">★★★★★ 4.9</div>
        </div>
        <div className="hero-float hero-float-2" ref={float2Ref}>
          <div className="f-title">Today's Offer</div>
          <div className="f-val">30% Off</div>
          <div className="f-sub">Hair Care Range</div>
        </div>
      </div>
    </section>
  );
}
