import { useState } from "react";
import { PRODUCTS } from "../data/constants";
import { disc, stars } from "../helpers";

function ProductCard({ product, onAddToCart, onOpenModal, wishlisted, onToggleWish }) {
  return (
    <div className="prod-card">
      <div className="prod-img-wrap">
        <img src={product.img} alt={product.name} loading="lazy" />
        {product.badge && <span className={`prod-badge ${product.badgeClass}`}>{product.badge}</span>}
        <button className={`prod-wish${wishlisted ? " active" : ""}`} onClick={e => { e.stopPropagation(); onToggleWish(product.id); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? "#388E3C" : "none"} stroke={wishlisted ? "#388E3C" : "#1B5E20"} strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <button className="prod-quick" onClick={e => { e.stopPropagation(); onAddToCart(product.id, product.sizes[0]); }}>+ Quick Add</button>
      </div>
      <div className="prod-info" onClick={() => onOpenModal(product)}>
        <div className="prod-brand">{product.brand}</div>
        <div className="prod-name">{product.name}</div>
        <div className="prod-stars-row">
          <span className="stars">{stars(product.rating)}</span>
          <span className="reviews-count">({product.reviews})</span>
        </div>
        <div className="prod-price-row">
          <span className="prod-price">₹{product.price.toLocaleString()}</span>
          <span className="prod-orig">₹{product.orig.toLocaleString()}</span>
          <span className="prod-disc">{disc(product)}% off</span>
          <button className="prod-add" onClick={e => { e.stopPropagation(); onAddToCart(product.id, product.sizes[0]); }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#FFFFFF" strokeWidth="1.5"><path d="M7 1v12M1 7h12" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Products({ filter, onFilterChange, searchQuery, onAddToCart, onOpenModal, wishlist, onToggleWish }) {
  const [sort, setSort] = useState("default");
  const FILTERS = ["All", "Hair Care", "Skin Care", "Oils", "Masks"];

  const filtered = (() => {
    let arr = [...PRODUCTS];
    if (filter !== "All") arr = arr.filter(p => p.category === filter);
    if (searchQuery) arr = arr.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    if (sort === "price-low") arr.sort((a, b) => a.price - b.price);
    else if (sort === "price-high") arr.sort((a, b) => b.price - a.price);
    else if (sort === "rating") arr.sort((a, b) => b.rating - a.rating);
    return arr;
  })();

  return (
    <section className="products-section" id="products">
      <div className="section-header">
        <div>
          <span className="section-tag">Shop</span>
          <h2 className="section-title">Featured <em>Products</em></h2>
        </div>
      </div>
      <div className="filter-bar">
        {FILTERS.map(f => (
          <button key={f} className={`filter-chip${filter === f ? " active" : ""}`} onClick={() => onFilterChange(f)}>{f}</button>
        ))}
        <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="default">Sort: Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
      <div className="prod-grid">
        {filtered.length === 0
          ? <p style={{ gridColumn: "1/-1", textAlign: "center", color: "var(--gray)", padding: "60px" }}>No products found 🌿</p>
          : filtered.map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onOpenModal={onOpenModal}
              wishlisted={wishlist.includes(p.id)} onToggleWish={onToggleWish} />
          ))
        }
      </div>
    </section>
  );
}
