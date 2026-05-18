import { useRef } from "react";
import { INGREDIENTS } from "../data/constants";
import { useReveal } from "../hooks/useAnimations";

export default function Ingredients() {
  const ref = useRef(null);
  useReveal(ref);
  return (
    <section className="ingredients-section" id="ingredients">
      <div className="ingr-intro reveal" ref={ref}>
        <span className="section-tag">Pure Ingredients</span>
        <h2 className="section-title">Powered by <em>Nature</em></h2>
        <p>Every formula begins with the finest botanical ingredients, ethically sourced and scientifically backed.</p>
      </div>
      <div className="ingr-grid">
        {INGREDIENTS.map((ing, i) => (
          <div key={i} className="ingr-card">
            <span className="ingr-icon">{ing.icon}</span>
            <div className="ingr-name">{ing.name}</div>
            <div className="ingr-desc">{ing.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
