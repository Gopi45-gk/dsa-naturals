/* ─── HELPERS ─── */

export const disc = (p) => Math.round((p.orig - p.price) / p.orig * 100);

export const stars = (r) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

export const animateCounter = (el, target, duration) => {
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const prog = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - prog, 3);
    el.textContent = Math.round(ease * target).toLocaleString();
    if (prog < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

export const loadGSAP = () =>
  new Promise((res) => {
    if (window.gsap) return res();
    const s1 = document.createElement("script");
    s1.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
    s1.onload = () => {
      const s2 = document.createElement("script");
      s2.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js";
      s2.onload = () => { window.gsap.registerPlugin(window.ScrollTrigger); res(); };
      document.head.appendChild(s2);
    };
    document.head.appendChild(s1);
  });
