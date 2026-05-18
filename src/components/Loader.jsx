import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Loader() {
  const loaderRef = useRef(null);
  const brandRef = useRef(null);
  const subRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    const fill = document.createElement('div');
    fill.style.cssText =
      'position:absolute;left:0;top:0;height:100%;width:0%;background:var(--leaf);transition:width 1.4s cubic-bezier(.4,0,.2,1)';
    barRef.current.appendChild(fill);
    setTimeout(() => (fill.style.width = '100%'), 50);

    const tl = gsap.timeline();
    tl.to(brandRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 })
      .to(subRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' })
      .to(loaderRef.current, { yPercent: -100, duration: 0.9, ease: 'power4.inOut', delay: 1.0 })
      .set(loaderRef.current, { display: 'none' });

    // Hero entrance animations are chained after loader
    tl.fromTo('.hero-badge', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' }, '-=.3')
      .fromTo('.hero-title .word', { y: '110%' }, { y: '0%', duration: 0.9, stagger: 0.08, ease: 'power4.out' }, '-=.4')
      .fromTo('.hero-desc', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, '-=.3')
      .fromTo('.hero-cta-row', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, '-=.4')
      .fromTo('.hero-stats', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, '-=.3')
      .fromTo('.hero-img-blob', { scale: 0 }, { scale: 1, duration: 1.0, ease: 'back.out(1.2)' }, '-=.8')
      .fromTo('.hero-float', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: 'back.out(1.5)' }, '-=.6');
  }, []);

  return (
    <div id="loader" ref={loaderRef}>
      <div id="loader-brand" ref={brandRef}>DSA Naturals</div>
      <div id="loader-sub" ref={subRef}>Pure · Natural · Radiant</div>
      <div id="loader-bar" ref={barRef}></div>
    </div>
  );
}
