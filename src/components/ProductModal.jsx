import { useState, useEffect } from "react";
import { disc, stars } from "../helpers";

export default function ProductModal({ product, open, onClose, onAddToCart }) {
  const [selSize, setSelSize] = useState("");
  const [qty, setQty] = useState(1);
  const [mainImg, setMainImg] = useState("");
  useEffect(() => {
    if (product) { setSelSize(product.sizes[0]); setQty(1); setMainImg(product.imgs[0]); }
  }, [product]);
  if (!product) return null;
  return (
    <div className={`modal-overlay-wrap${open ? " modal-open" : ""}`} style={{ opacity: open ? 1 : 0, pointerEvents: open ? "all" : "none" }}>
      <div className="modal-bg" onClick={onClose} />
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#1B5E20" strokeWidth="1.5"><path d="M2 2l10 10M12 2L2 12" /></svg>
        </button>
        <div className="modal-imgs">
          <img src={mainImg} alt={product.name} />
          <div className="modal-thumbs">
            {product.imgs.map((img, i) => (
              <img key={i} className={`thumb${img === mainImg ? " active" : ""}`} src={img} alt="" onClick={() => setMainImg(img)} />
            ))}
          </div>
        </div>
        <div className="modal-info">
          <div className="modal-brand">{product.brand}</div>
          <h2 className="modal-name">{product.name}</h2>
          <div className="modal-rating">
            <span style={{ color: "var(--gold)", fontSize: 14 }}>{stars(product.rating)} {product.rating}</span>
            <span style={{ fontSize: 13, color: "var(--gray)" }}>({product.reviews} reviews)</span>
          </div>
          <div className="modal-price-row">
            <span className="modal-price">₹{product.price.toLocaleString()}</span>
            <span className="modal-orig">₹{product.orig.toLocaleString()}</span>
            <span className="modal-disc-badge">{disc(product)}% off</span>
          </div>
          <p className="modal-desc">{product.desc}</p>
          <div className="modal-label">Size</div>
          <div className="size-opts">
            {product.sizes.map(s => (
              <button key={s} className={`size-btn${selSize === s ? " active" : ""}`} onClick={() => setSelSize(s)}>{s}</button>
            ))}
          </div>
          <div className="modal-label">Quantity</div>
          <div className="qty-row">
            <div className="qty-ctrl">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)}>+</button>
            </div>
          </div>
          <div className="modal-add-row">
            <button className="modal-add" onClick={() => { onAddToCart(product.id, selSize, qty); onClose(); }}>Add to Cart</button>
            <button className="modal-wish-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B5E20" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
