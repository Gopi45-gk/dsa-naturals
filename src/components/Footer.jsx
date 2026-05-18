export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-logo">DSA <span>Naturals</span></div>
          <p className="footer-about">Crafting pure, natural beauty solutions inspired by ancient Ayurvedic wisdom and modern science. Every product is a promise of quality.</p>
          <div className="social-row">
            {["facebook", "instagram", "twitter", "youtube"].map(s => (
              <button key={s} className="social-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cream)" strokeWidth="1.5">
                  {s === "facebook" && <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />}
                  {s === "instagram" && <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>}
                  {s === "twitter" && <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />}
                  {s === "youtube" && <><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></>}
                </svg>
              </button>
            ))}
          </div>
        </div>
        {[
          { title: "Shop", links: ["Hair Care", "Skin Care", "Natural Oils", "Masks & Packs", "Combos & Kits"] },
          { title: "Info", links: ["About Us", "Blog", "Sustainability", "Careers", "Press"] },
          { title: "Help", links: ["FAQ", "Shipping Policy", "Returns", "Track Order", "Contact Us"] },
        ].map(col => (
          <div key={col.title} className="footer-col">
            <h4>{col.title}</h4>
            <ul>{col.links.map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <p>© 2025 DSA Naturals. All rights reserved. Made with ♥ in India.</p>
        <div className="payment-icons">
          {["UPI", "VISA", "MC", "RuPay", "GPay"].map(p => <div key={p} className="pay-icon">{p}</div>)}
        </div>
      </div>
    </footer>
  );
}
