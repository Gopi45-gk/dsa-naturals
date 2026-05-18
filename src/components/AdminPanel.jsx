import { useState } from "react";

const ADMIN_NUMBERS = ["7904223010", "7305394506"];
const ADMIN_PASSWORD = "123456";

export default function AdminPanel({
  products,
  testimonials,
  upiId,
  orders,
  changeLog,
  onAddProduct,
  onDeleteProduct,
  onEditProduct,
  onAddTestimonial,
  onDeleteTestimonial,
  onUpdateUpi,
  onLogout,
  onBack,
}) {
  const [tab, setTab] = useState("products");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [upiInput, setUpiInput] = useState(upiId || "");

  // Product form state
  const emptyProduct = {
    name: "",
    brand: "DSA Naturals",
    category: "Hair Care",
    price: "",
    orig: "",
    rating: 4.5,
    reviews: 0,
    badge: "",
    badgeClass: "",
    img: "",
    imgs: "",
    desc: "",
    sizes: "",
  };
  const [productForm, setProductForm] = useState(emptyProduct);

  // Testimonial form state
  const [testiForm, setTestiForm] = useState({
    text: "",
    name: "",
    role: "",
    color: "#A5D6A7",
    textColor: "#1B5E20",
  });

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const product = {
      ...productForm,
      id: editingProduct ? editingProduct.id : Date.now(),
      price: Number(productForm.price),
      orig: Number(productForm.orig),
      rating: Number(productForm.rating),
      reviews: Number(productForm.reviews),
      imgs: productForm.imgs
        ? productForm.imgs.split(",").map((s) => s.trim())
        : [productForm.img],
      sizes: productForm.sizes
        ? productForm.sizes.split(",").map((s) => s.trim())
        : ["Default"],
      badgeClass: productForm.badge === "Best Seller" ? "hot" : productForm.badge === "New" ? "new" : productForm.badge === "Sale" ? "sale" : "",
    };

    if (editingProduct) {
      onEditProduct(product);
    } else {
      onAddProduct(product);
    }
    setProductForm(emptyProduct);
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      ...product,
      price: String(product.price),
      orig: String(product.orig),
      imgs: product.imgs ? product.imgs.join(", ") : product.img,
      sizes: product.sizes ? product.sizes.join(", ") : "",
    });
    setShowProductForm(true);
  };

  const handleTestimonialSubmit = (e) => {
    e.preventDefault();
    onAddTestimonial({
      ...testiForm,
      id: Date.now(),
    });
    setTestiForm({ text: "", name: "", role: "", color: "#A5D6A7", textColor: "#1B5E20" });
    setShowTestimonialForm(false);
  };

  const handleUpiSave = () => {
    if (upiInput.trim()) {
      onUpdateUpi(upiInput.trim());
    }
  };

  const tabs = [
    { key: "products", label: "Products", icon: "📦" },
    { key: "reviews", label: "Reviews", icon: "⭐" },
    { key: "upi", label: "UPI / Payments", icon: "💳" },
    { key: "orders", label: "Orders", icon: "📋" },
    { key: "log", label: "Change Log", icon: "📝" },
  ];

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <button className="admin-back-btn" onClick={onBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Store
          </button>
          <h1 className="admin-title">Admin Dashboard</h1>
        </div>
        <button className="admin-logout-btn" onClick={onLogout}>Logout</button>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">📦</div>
          <div className="admin-stat-num">{products.length}</div>
          <div className="admin-stat-label">Products</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">⭐</div>
          <div className="admin-stat-num">{testimonials.length}</div>
          <div className="admin-stat-label">Reviews</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">📋</div>
          <div className="admin-stat-num">{orders.length}</div>
          <div className="admin-stat-label">Orders</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">📝</div>
          <div className="admin-stat-num">{changeLog.length}</div>
          <div className="admin-stat-label">Changes</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`admin-tab${tab === t.key ? " active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="admin-content">
        {/* ── Products Tab ── */}
        {tab === "products" && (
          <div>
            <div className="admin-section-header">
              <h2>Manage Products</h2>
              <button
                className="admin-add-btn"
                onClick={() => {
                  setProductForm(emptyProduct);
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
              >
                + Add Product
              </button>
            </div>

            {showProductForm && (
              <form className="admin-form" onSubmit={handleProductSubmit}>
                <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label>Product Name *</label>
                    <input
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g. Argan Oil Hair Serum"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Brand</label>
                    <input
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    >
                      <option>Hair Care</option>
                      <option>Skin Care</option>
                      <option>Oils</option>
                      <option>Masks</option>
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>Badge</label>
                    <select
                      value={productForm.badge}
                      onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    >
                      <option value="">None</option>
                      <option>Best Seller</option>
                      <option>New</option>
                      <option>Sale</option>
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>Price (₹) *</label>
                    <input
                      required
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="449"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Original Price (₹) *</label>
                    <input
                      required
                      type="number"
                      value={productForm.orig}
                      onChange={(e) => setProductForm({ ...productForm, orig: e.target.value })}
                      placeholder="699"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Rating (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={productForm.rating}
                      onChange={(e) => setProductForm({ ...productForm, rating: e.target.value })}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Sizes (comma-separated)</label>
                    <input
                      value={productForm.sizes}
                      onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                      placeholder="50ml, 100ml, 200ml"
                    />
                  </div>
                  <div className="admin-field full-width">
                    <label>Image URL *</label>
                    <input
                      required
                      value={productForm.img}
                      onChange={(e) => setProductForm({ ...productForm, img: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="admin-field full-width">
                    <label>Additional Image URLs (comma-separated)</label>
                    <input
                      value={productForm.imgs}
                      onChange={(e) => setProductForm({ ...productForm, imgs: e.target.value })}
                      placeholder="https://..., https://..."
                    />
                  </div>
                  <div className="admin-field full-width">
                    <label>Description *</label>
                    <textarea
                      required
                      value={productForm.desc}
                      onChange={(e) => setProductForm({ ...productForm, desc: e.target.value })}
                      placeholder="Product description..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="admin-form-actions">
                  <button type="submit" className="admin-save-btn">
                    {editingProduct ? "Update Product" : "Add Product"}
                  </button>
                  <button
                    type="button"
                    className="admin-cancel-btn"
                    onClick={() => {
                      setShowProductForm(false);
                      setEditingProduct(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <img src={p.img} alt={p.name} className="admin-table-img" />
                      </td>
                      <td>
                        <strong>{p.name}</strong>
                        <br />
                        <small>{p.brand}</small>
                      </td>
                      <td>{p.category}</td>
                      <td>
                        ₹{p.price}
                        {p.orig && <small style={{ textDecoration: "line-through", color: "#999", marginLeft: 6 }}>₹{p.orig}</small>}
                      </td>
                      <td>{p.rating} ★</td>
                      <td>
                        <button className="admin-edit-btn" onClick={() => startEdit(p)}>Edit</button>
                        <button className="admin-delete-btn" onClick={() => onDeleteProduct(p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Reviews Tab ── */}
        {tab === "reviews" && (
          <div>
            <div className="admin-section-header">
              <h2>Manage Reviews</h2>
              <button className="admin-add-btn" onClick={() => setShowTestimonialForm(true)}>
                + Add Review
              </button>
            </div>

            {showTestimonialForm && (
              <form className="admin-form" onSubmit={handleTestimonialSubmit}>
                <h3>Add New Review</h3>
                <div className="admin-form-grid">
                  <div className="admin-field full-width">
                    <label>Review Text *</label>
                    <textarea
                      required
                      value={testiForm.text}
                      onChange={(e) => setTestiForm({ ...testiForm, text: e.target.value })}
                      placeholder="What the customer said..."
                      rows={3}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Customer Name *</label>
                    <input
                      required
                      value={testiForm.name}
                      onChange={(e) => setTestiForm({ ...testiForm, name: e.target.value })}
                      placeholder="Priya Sharma"
                    />
                  </div>
                  <div className="admin-field">
                    <label>City *</label>
                    <input
                      required
                      value={testiForm.role}
                      onChange={(e) => setTestiForm({ ...testiForm, role: e.target.value })}
                      placeholder="Chennai"
                    />
                  </div>
                </div>
                <div className="admin-form-actions">
                  <button type="submit" className="admin-save-btn">Add Review</button>
                  <button type="button" className="admin-cancel-btn" onClick={() => setShowTestimonialForm(false)}>Cancel</button>
                </div>
              </form>
            )}

            <div className="admin-review-list">
              {testimonials.map((t, i) => (
                <div key={t.id || i} className="admin-review-card">
                  <div className="admin-review-quote">"</div>
                  <p className="admin-review-text">{t.text}</p>
                  <div className="admin-review-meta">
                    <div
                      className="admin-review-avatar"
                      style={{ background: t.color, color: t.textColor }}
                    >
                      {t.name[0]}
                    </div>
                    <div>
                      <strong>{t.name}</strong>
                      <br />
                      <small>{t.role}</small>
                    </div>
                    <button
                      className="admin-delete-btn"
                      style={{ marginLeft: "auto" }}
                      onClick={() => onDeleteTestimonial(t.id || i)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── UPI Tab ── */}
        {tab === "upi" && (
          <div>
            <div className="admin-section-header">
              <h2>Payment Settings</h2>
            </div>
            <div className="admin-form" style={{ maxWidth: 500 }}>
              <h3>UPI ID for Online Payments</h3>
              <p style={{ fontSize: 14, color: "#777", marginBottom: 20 }}>
                Set the UPI ID that customers will see during checkout for making payments.
              </p>
              <div className="admin-field">
                <label>UPI ID</label>
                <input
                  value={upiInput}
                  onChange={(e) => setUpiInput(e.target.value)}
                  placeholder="merchant@upi"
                />
              </div>
              <div className="admin-form-actions">
                <button className="admin-save-btn" onClick={handleUpiSave}>
                  Save UPI ID
                </button>
              </div>
              {upiId && (
                <div className="admin-upi-display">
                  <span>Current UPI ID:</span>
                  <strong>{upiId}</strong>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Orders Tab ── */}
        {tab === "orders" && (
          <div>
            <div className="admin-section-header">
              <h2>Orders</h2>
            </div>
            {orders.length === 0 ? (
              <div className="admin-empty">
                <p>No orders yet. Orders placed by customers will appear here.</p>
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td>#{o.id}</td>
                        <td>{o.customer}</td>
                        <td>{o.items.map((i) => `${i.name} x${i.qty}`).join(", ")}</td>
                        <td>₹{o.total.toLocaleString()}</td>
                        <td>{new Date(o.date).toLocaleDateString()}</td>
                        <td>
                          <span className={`admin-order-status ${o.status}`}>{o.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Change Log Tab ── */}
        {tab === "log" && (
          <div>
            <div className="admin-section-header">
              <h2>Admin Change Log</h2>
            </div>
            {changeLog.length === 0 ? (
              <div className="admin-empty">
                <p>No changes recorded yet.</p>
              </div>
            ) : (
              <div className="admin-log-list">
                {changeLog.map((entry, i) => (
                  <div key={i} className="admin-log-item">
                    <div className="admin-log-badge">
                      {entry.type === "product" ? "📦" : entry.type === "review" ? "⭐" : entry.type === "upi" ? "💳" : "📝"}
                    </div>
                    <div className="admin-log-content">
                      <strong>{entry.action}</strong>
                      <p>{entry.detail}</p>
                    </div>
                    <div className="admin-log-time">
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Admin login component (mobile + password, no OTP)
export function AdminLogin({ onAdminLogin, onBack }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ADMIN_NUMBERS.includes(phone) && password === ADMIN_PASSWORD) {
      onAdminLogin(phone);
    } else {
      setError("Invalid mobile number or password");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-orb auth-orb-1" />
      <div className="auth-bg-orb auth-orb-2" />
      <div className="auth-bg-orb auth-orb-3" />

      <div className="auth-container visible">
        <button className="auth-back-btn" onClick={onBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="auth-card">
          <div className="auth-card-glow" />
          <h2 className="auth-title">Admin Login</h2>
          <p className="auth-subtitle">Sign in with your admin credentials</p>

          {error && <div className="admin-login-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-label">Mobile Number</label>
            <div className="auth-phone-row" style={{ marginBottom: 16 }}>
              <input
                type="tel"
                className="auth-phone-input"
                placeholder="Enter admin mobile number"
                value={phone}
                onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                maxLength={10}
                autoFocus
              />
            </div>

            <label className="auth-label">Password</label>
            <div className="auth-phone-row" style={{ marginBottom: 16 }}>
              <input
                type="password"
                className="auth-phone-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
              />
            </div>

            <button
              type="submit"
              className={`auth-submit${phone.length >= 10 && password ? " ready" : ""}`}
              disabled={phone.length < 10 || !password}
            >
              <span>Login as Admin</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
