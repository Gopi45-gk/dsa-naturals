import { useEffect, useRef, useCallback } from "react";

const LOGO_URL = "https://www.image2url.com/r2/default/images/1779000185015-e3a959ed-db44-4e32-8f67-af6ec4dcc4f5.png";

const PARTICLES = [
  { s: 65, l: 7, d: 0.3, dr: 11 }, { s: 40, l: 19, d: 1.8, dr: 9 },
  { s: 85, l: 35, d: 0.1, dr: 13 }, { s: 28, l: 50, d: 3.2, dr: 8 },
  { s: 58, l: 63, d: 0.9, dr: 10 }, { s: 44, l: 76, d: 3.8, dr: 9 },
  { s: 52, l: 13, d: 2.5, dr: 11 }, { s: 32, l: 87, d: 0.6, dr: 8 },
  { s: 78, l: 43, d: 1.3, dr: 13 }, { s: 22, l: 57, d: 4.8, dr: 7 },
  { s: 62, l: 28, d: 2.9, dr: 12 }, { s: 48, l: 70, d: 0.2, dr: 9 },
  { s: 36, l: 4, d: 4.2, dr: 10 }, { s: 72, l: 93, d: 1.6, dr: 12 },
];

export default function SplashScreen({ onComplete }) {
  const splashRef = useRef(null);
  const leafRef = useRef(null);
  const ldRef = useRef(null);
  const lsRef = useRef(null);
  const laRef = useRef(null);
  const divlRef = useRef(null);
  const natRef = useRef(null);
  const tagRef = useRef(null);
  const swpRef = useRef(null);
  const c1Ref = useRef(null);
  const c2Ref = useRef(null);
  const c3Ref = useRef(null);
  const c4Ref = useRef(null);
  const pfRef = useRef(null);
  const timersRef = useRef([]);
  const intervalRef = useRef(null);

  const clearAll = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    clearInterval(intervalRef.current);
    timersRef.current = [];
  }, []);

  useEffect(() => {
    const addShow = (ref, ms) => {
      timersRef.current.push(setTimeout(() => {
        if (ref.current) ref.current.classList.add("show");
      }, ms));
    };

    // Progress bar
    let p = 0;
    intervalRef.current = setInterval(() => {
      p = Math.min(p + 2.4, 100);
      if (pfRef.current) pfRef.current.style.width = p + "%";
    }, 100);

    addShow(leafRef, 280);
    addShow(ldRef, 920);
    addShow(lsRef, 1210);
    addShow(laRef, 1500);
    addShow(divlRef, 1900);
    addShow(natRef, 2280);

    timersRef.current.push(setTimeout(() => {
      [tagRef, c1Ref, c2Ref, c3Ref, c4Ref].forEach(r => {
        if (r.current) r.current.classList.add("show");
      });
      if (swpRef.current) swpRef.current.classList.add("go");
    }, 2800));

    timersRef.current.push(setTimeout(() => {
      clearInterval(intervalRef.current);
      if (pfRef.current) pfRef.current.style.width = "100%";
      if (splashRef.current) splashRef.current.classList.add("exit");
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 900);
    }, 4500));

    return () => clearAll();
  }, [onComplete, clearAll]);

  return (
    <div id="splash" ref={splashRef}>
      {/* Particles */}
      <div className="splash-ptc">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="splash-p"
            style={{
              width: p.s + "px",
              height: p.s + "px",
              left: p.l + "%",
              animationDelay: p.d + "s",
              animationDuration: p.dr + "s",
            }}
          />
        ))}
      </div>

      {/* Ambient glow */}
      <div className="splash-amb" />
      <div className="splash-vig" />

      {/* Sweep light */}
      <div className="splash-swp" ref={swpRef} />

      {/* Corner brackets */}
      <div className="splash-cr splash-tl" ref={c1Ref} />
      <div className="splash-cr splash-tr" ref={c2Ref} />
      <div className="splash-cr splash-bl" ref={c3Ref} />
      <div className="splash-cr splash-br" ref={c4Ref} />

      {/* Center content */}
      <div className="splash-ctr">
        <div className="splash-lf" ref={leafRef}>
          <img src={LOGO_URL} alt="DSA Naturals Logo" />
        </div>
        <div className="splash-dsa">
          <span className="splash-lt" ref={ldRef}>D</span>
          <span className="splash-lt" ref={lsRef}>S</span>
          <span className="splash-lt" ref={laRef}>A</span>
        </div>
        <div className="splash-divl" ref={divlRef} />
        <div className="splash-nat" ref={natRef}>Naturals</div>
        <div className="splash-tag" ref={tagRef}>
          Pure &nbsp;·&nbsp; Natural &nbsp;·&nbsp; Organic
        </div>
      </div>

      {/* Progress bar */}
      <div className="splash-pb">
        <div className="splash-pf" ref={pfRef} />
      </div>
    </div>
  );
}
