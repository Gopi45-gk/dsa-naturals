import { useRef } from "react";
import { TESTIMONIALS } from "../data/constants";
import { useReveal } from "../hooks/useAnimations";

export default function Testimonials() {
  const ref = useRef(null);
  useReveal(ref);
  return (
    <section className="testi-section" id="testimonials">
      <div className="reveal" ref={ref} style={{ textAlign: "center" }}>
        <span className="section-tag">Reviews</span>
        <h2 className="section-title">What Our <em>Customers</em> Say</h2>
      </div>
      <div className="testi-grid">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="testi-card">
            <div className="testi-quote">"</div>
            <p className="testi-text">{t.text}</p>
            <div className="testi-stars">★★★★★</div>
            <div className="testi-user">
              <div className="testi-avatar" style={{ background: t.color, color: t.textColor }}>{t.name[0]}</div>
              <div>
                <div className="t-name">{t.name}</div>
                <div className="t-role">{t.role} · <span className="verified">✓ Verified</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
