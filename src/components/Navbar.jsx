import { useState, useEffect } from "react";

export default function Navbar({ cartCount, onCartOpen, onFilterCategory, searchQuery, onSearch, onLoginClick }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <nav className={`dsa-nav${scrolled ? " scrolled" : ""}`}>
      <span className="nav-logo">DSA <span>Naturals</span></span>
      <ul className="nav-links">
        {[["categories", "Collections"], ["products", "Shop"], ["ingredients", "Ingredients"], ["testimonials", "Reviews"]].map(([id, label]) => (
          <li key={id}><button className="nav-link-item" onClick={() => scrollTo(id)}>{label}</button></li>
        ))}
      </ul>
      <div className="nav-right">
        <div className="nav-search-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="1.8"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <input type="text" placeholder="Search products…" value={searchQuery} onChange={e => onSearch(e.target.value)} />
        </div>
        <button className="user-btn" onClick={onLoginClick}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B5E20" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
        </button>
        <button className="cart-btn" onClick={onCartOpen}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B5E20" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
          <span className="cart-badge">{cartCount}</span>
        </button>
      </div>
    </nav>
  );
}
