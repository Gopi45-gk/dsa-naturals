export default function CartSidebar({ cart, open, onClose, onChangeQty, onRemove }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  return (
    <>
      {open && <div className="cart-overlay-bg" onClick={onClose} />}
      <div className={`cart-sidebar${open ? " open" : ""}`}>
        <div className="cart-head">
          <h2>Your Cart ({count})</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#1B5E20" strokeWidth="1.5"><path d="M3 3l10 10M13 3L3 13" /></svg>
          </button>
        </div>
        <div className="cart-items">
          {cart.length === 0
            ? <p className="cart-empty">Your cart is empty 🌿</p>
            : cart.map((item, i) => (
              <div key={i} className="cart-item">
                <img className="ci-img" src={item.img} alt={item.name} />
                <div className="ci-info">
                  <div className="ci-name">{item.name}</div>
                  <div className="ci-var">{item.size}</div>
                  <div className="ci-qty">
                    <button className="qty-btn" onClick={() => onChangeQty(item.id, item.size, -1)}>−</button>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{item.qty}</span>
                    <button className="qty-btn" onClick={() => onChangeQty(item.id, item.size, 1)}>+</button>
                    <button className="ci-remove" onClick={() => onRemove(item.id, item.size)}>Remove</button>
                  </div>
                </div>
                <div className="ci-price">₹{(item.price * item.qty).toLocaleString()}</div>
              </div>
            ))
          }
        </div>
        <div className="cart-foot">
          <div className="cart-subtotal">
            <span>Subtotal</span>
            <span className="cart-subtotal-val">₹{total.toLocaleString()}</span>
          </div>
          <p className="free-ship">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="5" width="9" height="8" rx="1" /><path d="M10 7h2l1 2v3h-3V7z" /><circle cx="3" cy="13" r="1" /><circle cx="11" cy="13" r="1" /></svg>
            Free shipping on orders above ₹599
          </p>
          <button className="checkout-btn">Proceed to Checkout →</button>
          <button className="gpay-btn">Pay with Google Pay</button>
        </div>
      </div>
    </>
  );
}
