import { useRef } from "react";
import { CATEGORIES } from "../data/constants";
import { useReveal } from "../hooks/useAnimations";

export default function Categories({ onFilterCategory }) {
  const ref = useRef(null);
  useReveal(ref);
  return (
    <section className="section-wrap" id="categories">
      <div className="section-header reveal" ref={ref}>
        <div>
          <span className="section-tag">Explore</span>
          <h2 className="section-title">Our <em>Collections</em></h2>
        </div>
        <button className="view-all" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>View All →</button>
      </div>
      <div className="cat-grid">
        {CATEGORIES.map((cat, i) => (
          <div key={i} className={`cat-card${cat.span === 2 ? " wide" : ""}`} onClick={() => onFilterCategory(cat.name)}>
            <img className="cat-img" src={cat.img} alt={cat.name} loading="lazy" />
            <div className="cat-overlay" />
            <div className="cat-label"><h3>{cat.name}</h3><span>{cat.count} Products</span></div>
            {cat.pill && <span className="cat-pill">{cat.pill}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
