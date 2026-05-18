import { MARQUEE_ITEMS } from "../data/constants";

export default function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="marquee-section">
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={i} className="marquee-item">{item}<span className="m-dot">✦</span></span>
        ))}
      </div>
    </div>
  );
}
