import { useState, useEffect, useRef } from "react";
import { useReveal } from "../hooks/useAnimations";

export default function OfferBanner() {
  const ref = useRef(null);
  useReveal(ref);
  const [time, setTime] = useState({ h: "00", m: "00", s: "00" });
  useEffect(() => {
    const tick = () => {
      const end = new Date(); end.setHours(23, 59, 59, 0);
      const diff = end - new Date();
      if (diff <= 0) return;
      setTime({
        h: String(Math.floor(diff / 3600000)).padStart(2, "0"),
        m: String(Math.floor(diff % 3600000 / 60000)).padStart(2, "0"),
        s: String(Math.floor(diff % 60000 / 1000)).padStart(2, "0"),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="offer-banner reveal" ref={ref}>
      <div>
        <div className="offer-tag">Limited Time Offer</div>
        <h2 className="offer-title">Get 30% Off On All Hair Care Products</h2>
        <p className="offer-desc">Use our exclusive coupon code at checkout and transform your hair care routine with nature's finest ingredients.</p>
        <div className="offer-code">
          <span className="oc-label">Use Code</span>
          <span className="oc-code">DSAHAIR30</span>
        </div>
        <div className="timer-row">
          <div className="timer-box"><div className="timer-num">{time.h}</div><div className="timer-label">Hours</div></div>
          <div className="timer-sep">:</div>
          <div className="timer-box"><div className="timer-num">{time.m}</div><div className="timer-label">Mins</div></div>
          <div className="timer-sep">:</div>
          <div className="timer-box"><div className="timer-num">{time.s}</div><div className="timer-label">Secs</div></div>
        </div>
      </div>
      <div className="offer-img">
        <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80" alt="Offer" />
      </div>
    </div>
  );
}
