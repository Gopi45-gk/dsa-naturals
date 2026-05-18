import { useState, useEffect, useRef, useCallback } from "react";
import SplashScreen from "./components/SplashScreen";
import LoginScreen from "./components/LoginScreen";
import AdminPanel, { AdminLogin } from "./components/AdminPanel";
import "./components/auth.css";

/* ─── GSAP loaded from CDN via useEffect ─── */
const loadGSAP = () =>
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

/* ─── FONTS ─── */
const FONT_LINK = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;1,600&display=swap";

/* ─── DATA ─── */
const PRODUCTS = [
  { id: 1, name: "Argan Oil Hair Serum", brand: "DSA Hair", category: "Hair Care", price: 449, orig: 699, rating: 4.9, reviews: 328, badge: "Best Seller", badgeClass: "hot", img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80", imgs: ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80", "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80"], desc: "Lightweight, non-greasy serum packed with pure Moroccan Argan Oil. Controls frizz, adds brilliant shine, and nourishes each strand deeply.", sizes: ["50ml", "100ml", "200ml"] },
  { id: 2, name: "Rose Hip Face Serum", brand: "DSA Skin", category: "Skin Care", price: 599, orig: 899, rating: 4.8, reviews: 214, badge: "New", badgeClass: "new", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80", imgs: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80"], desc: "A potent Vitamin C & Rosehip oil blend that brightens dull skin, fades dark spots, and delivers a youthful, radiant glow.", sizes: ["30ml", "50ml"] },
  { id: 3, name: "Coconut Deep Repair Mask", brand: "DSA Hair", category: "Hair Care", price: 349, orig: 499, rating: 4.7, reviews: 186, badge: "Sale", badgeClass: "sale", img: "https://images.unsplash.com/photo-1600857062241-98e5dba7f114?w=400&q=80", imgs: ["https://images.unsplash.com/photo-1600857062241-98e5dba7f114?w=600&q=80"], desc: "Intensive conditioning hair mask with virgin coconut oil and shea butter. Revives damaged, brittle hair in just one use.", sizes: ["150g", "300g"] },
  { id: 4, name: "Aloe Vera Gel Moisturiser", brand: "DSA Skin", category: "Skin Care", price: 299, orig: 449, rating: 4.6, reviews: 412, badge: "", badgeClass: "", img: "https://images.unsplash.com/photo-1611125532756-d073acfb5e6b?w=400&q=80", imgs: ["https://images.unsplash.com/photo-1611125532756-d073acfb5e6b?w=600&q=80"], desc: "Pure aloe vera gel blended with cucumber extract. Ultra-light, absorbs instantly, soothes redness and provides all-day hydration.", sizes: ["100g", "250g"] },
  { id: 5, name: "Castor Hair Growth Oil", brand: "DSA Hair", category: "Oils", price: 399, orig: 599, rating: 4.8, reviews: 298, badge: "Best Seller", badgeClass: "hot", img: "https://images.unsplash.com/photo-1574080580498-5b9e5c5b7989?w=400&q=80", imgs: ["https://images.unsplash.com/photo-1574080580498-5b9e5c5b7989?w=600&q=80"], desc: "Cold-pressed black castor oil enriched with biotin and rosemary essential oil. Stimulates hair follicles for thicker, fuller growth.", sizes: ["100ml", "200ml"] },
  { id: 6, name: "Turmeric Glow Face Pack", brand: "DSA Skin", category: "Masks", price: 249, orig: 399, rating: 4.7, reviews: 167, badge: "New", badgeClass: "new", img: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&q=80", imgs: ["https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80"], desc: "Ancient Ayurvedic turmeric and sandalwood face pack. Brightens complexion, controls oiliness, and gives an instant golden glow.", sizes: ["75g", "150g"] },
  { id: 7, name: "Jojoba Scalp Treatment", brand: "DSA Hair", category: "Oils", price: 499, orig: 750, rating: 4.9, reviews: 94, badge: "", badgeClass: "", img: "https://images.unsplash.com/photo-1552693673-1bf958298935?w=400&q=80", imgs: ["https://images.unsplash.com/photo-1552693673-1bf958298935?w=600&q=80"], desc: "Lightweight jojoba oil with tea tree and peppermint. Balances scalp sebum, soothes dandruff, and promotes a healthy scalp environment.", sizes: ["50ml", "100ml"] },
  { id: 8, name: "Multani Mitti Clay Mask", brand: "DSA Skin", category: "Masks", price: 189, orig: 299, rating: 4.5, reviews: 223, badge: "", badgeClass: "", img: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=400&q=80", imgs: ["https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&q=80"], desc: "Traditional Fuller's earth with rosewater and neem. Deep cleanses pores, removes impurities and controls excess oil naturally.", sizes: ["100g", "200g"] },
];

const CATEGORIES = [
  { name: "Hair Care", count: 24, pill: "Bestseller", img: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&q=80", span: 2 },
  { name: "Skin Care", count: 18, pill: "", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80", span: 1 },
  { name: "Oils", count: 12, pill: "", img: "https://images.unsplash.com/photo-1600857062241-98e5dba7f114?w=600&q=80", span: 1 },
  { name: "Masks", count: 10, pill: "New", img: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80", span: 1 },
];

const INGREDIENTS = [
  { icon: "🌿", name: "Aloe Vera", desc: "Deeply hydrates & soothes irritated skin" },
  { icon: "🥥", name: "Coconut Oil", desc: "Nourishes hair from root to tip" },
  { icon: "🌹", name: "Rose Hip", desc: "Rich in Vitamin C for radiant skin" },
  { icon: "🍯", name: "Raw Honey", desc: "Natural humectant & antibacterial" },
  { icon: "🫚", name: "Argan Oil", desc: "Liquid gold for silky smooth hair" },
];

const TESTIMONIALS = [
  { text: "The Argan Oil Hair Serum completely transformed my frizzy hair. After just two weeks, my hair is smoother, shinier, and healthier than ever before!", name: "Priya Sharma", role: "Chennai", color: "#A5D6A7", textColor: "#1B5E20" },
  { text: "I've tried so many skincare brands but DSA Naturals is truly different. The Rose Hip Face Serum cleared my acne scars in just a month. Absolutely love it!", name: "Anika Reddy", role: "Bangalore", color: "#8FAE91", textColor: "#fff" },
  { text: "My skin feels like velvet after using the Aloe & Honey moisturiser. Natural, effective, and smells divine. Will never go back to chemical products!", name: "Rahul Menon", role: "Mumbai", color: "#66BB6A", textColor: "#1B5E20" },
];

const MARQUEE_ITEMS = ["Free Shipping on ₹599+", "100% Natural Ingredients", "No Parabens", "Dermatologist Tested", "Cruelty Free", "Vegan Certified", "Made in India"];

/* ─── HELPERS ─── */
const disc = (p) => Math.round((p.orig - p.price) / p.orig * 100);
const stars = (r) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

/* ─── LOCAL STORAGE HELPERS ─── */
const STORAGE_KEYS = {
  PRODUCTS: "dsa_admin_products",
  TESTIMONIALS: "dsa_admin_testimonials",
  UPI: "dsa_admin_upi",
  ORDERS: "dsa_admin_orders",
  CHANGE_LOG: "dsa_admin_changelog",
};

function loadFromStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("localStorage save failed:", e);
  }
}

function addChangeLogEntry(existing, entry) {
  const updated = [{ ...entry, timestamp: Date.now() }, ...existing].slice(0, 100);
  saveToStorage(STORAGE_KEYS.CHANGE_LOG, updated);
  return updated;
}
const animateCounter = (el, target, duration) => {
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

/* ═══════════════════════════════════════════
   GLOBAL STYLES injected once
═══════════════════════════════════════════ */
const GLOBAL_CSS = `
@import url('${FONT_LINK}');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --cream:#FAF7F2;--cream2:#F3EDE3;--bark:#1B5E20;--bark2:#2E7D32;
  --sage:#5C7A5F;--sage2:#8FAE91;--gold:#388E3C;--gold2:#66BB6A;
  --blush:#A5D6A7;--blush2:#C8E6C9;--white:#FFFFFF;--gray:#777;
  --ff-d:'Cormorant Garamond',serif;--ff-h:'Playfair Display',serif;
  --ff-b:'DM Sans',sans-serif;
}
html{scroll-behavior:smooth;overflow-x:hidden}
body{font-family:var(--ff-b);background:var(--cream);color:var(--bark);overflow-x:hidden}
.dsa-nav{position:fixed;top:0;left:0;right:0;z-index:800;padding:0 5%;display:flex;align-items:center;justify-content:space-between;height:72px;background:transparent;transition:background .4s,backdrop-filter .4s}
.dsa-nav.scrolled{background:rgba(250,247,242,.92);backdrop-filter:blur(12px);box-shadow:0 1px 0 rgba(44,26,14,.08)}
.nav-logo{font-family:var(--ff-d);font-size:28px;font-weight:400;letter-spacing:.08em;color:var(--bark);text-decoration:none;cursor:pointer}
.nav-logo span{color:var(--gold)}
.nav-links{display:flex;gap:36px;list-style:none}
.nav-link-item{font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--bark);text-decoration:none;font-weight:500;position:relative;cursor:pointer;background:none;border:none;font-family:var(--ff-b)}
.nav-link-item::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:1px;background:var(--gold);transition:width .3s}
.nav-link-item:hover::after{width:100%}
.nav-right{display:flex;align-items:center;gap:20px}
.nav-search-box{display:flex;align-items:center;gap:8px;border:1px solid rgba(44,26,14,.2);border-radius:24px;padding:6px 16px;background:transparent}
.nav-search-box input{border:none;background:transparent;font-family:var(--ff-b);font-size:13px;color:var(--bark);outline:none;width:140px}
.nav-search-box input::placeholder{color:var(--gray)}
.cart-btn{background:none;border:none;cursor:pointer;position:relative}
.cart-badge{position:absolute;top:-6px;right:-6px;background:var(--gold);color:#fff;font-size:9px;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600}
.user-btn{background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .25s;}
.user-btn:hover{transform:scale(1.1);}
/* LOGIN */
.login-page{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--cream) 0%,var(--blush2) 100%);padding:40px 5%;position:relative;}
.login-container{max-width:480px;width:100%;position:relative;z-index:2;}
.login-back{display:inline-flex;align-items:center;gap:8px;background:none;border:none;font-family:var(--ff-b);font-size:14px;color:var(--bark);margin-bottom:24px;cursor:pointer;opacity:0.7;transition:opacity 0.2s;}
.login-back:hover{opacity:1;}
.login-box{background:rgba(255,255,255,0.85);backdrop-filter:blur(20px);padding:48px;border-radius:32px;box-shadow:0 24px 80px rgba(44,26,14,0.08);border:1px solid rgba(255,255,255,0.5);}
.login-box h2{font-family:var(--ff-h);font-size:36px;color:var(--bark);margin-bottom:8px;font-weight:700;}
.login-box p{font-size:15px;color:var(--gray);margin-bottom:32px;}
.login-form{display:flex;flex-direction:column;gap:20px;}
.form-group{display:flex;flex-direction:column;gap:8px;text-align:left;}
.form-group label{font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:var(--bark);font-weight:600;}
.form-group input{padding:14px 16px;border:1.5px solid rgba(44,26,14,0.15);border-radius:12px;background:transparent;font-family:var(--ff-b);font-size:15px;color:var(--bark);transition:all 0.2s;}
.form-group input:focus{border-color:var(--gold);outline:none;background:#fff;box-shadow:0 0 0 4px rgba(201,151,58,0.1);}
.form-options{display:flex;align-items:center;justify-content:space-between;font-size:13px;margin-top:4px;}
.remember-me{display:flex;align-items:center;gap:8px;color:var(--bark);cursor:pointer;}
.forgot-pwd{color:var(--sage);text-decoration:none;font-weight:500;}
.login-submit{background:var(--bark);color:var(--cream);border:none;padding:16px;border-radius:12px;font-family:var(--ff-b);font-size:15px;font-weight:600;letter-spacing:0.05em;cursor:pointer;margin-top:12px;transition:background 0.3s,transform 0.2s;}
.login-submit:hover{background:var(--gold);transform:translateY(-2px);}
.login-footer{margin-top:32px;text-align:center;font-size:14px;color:var(--gray);}
.login-footer a{color:var(--bark);font-weight:600;text-decoration:none;margin-left:4px;border-bottom:1px solid var(--bark);}
/* LOADER */
.loader{position:fixed;inset:0;background:var(--bark);z-index:9000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px}
.loader-brand{font-family:var(--ff-d);font-size:clamp(40px,8vw,96px);color:var(--cream);font-weight:300;letter-spacing:.15em;opacity:0}
.loader-sub{font-family:var(--ff-b);font-size:13px;letter-spacing:.4em;color:var(--gold);text-transform:uppercase;opacity:0}
.loader-bar{width:200px;height:1px;background:rgba(255,255,255,.15);position:relative;overflow:hidden}
.loader-fill{position:absolute;left:0;top:0;height:100%;width:0%;background:var(--gold);transition:width 1.4s cubic-bezier(.4,0,.2,1)}
/* HERO */
.hero{height:100vh;display:grid;grid-template-columns:1fr 1fr;position:relative;overflow:hidden}
.hero-left{display:flex;flex-direction:column;justify-content:center;padding:0 8% 0 6%;position:relative;z-index:2}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:var(--blush2);border-radius:24px;padding:6px 16px;margin-bottom:32px;opacity:0}
.hero-badge::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--gold);flex-shrink:0}
.hero-badge span{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--bark2);font-weight:500}
.hero-title{font-family:var(--ff-h);font-size:clamp(42px,5.5vw,80px);line-height:1.08;font-weight:700;margin-bottom:24px}
.hero-title .line{display:block;overflow:hidden}
.hero-title .word{display:inline-block;transform:translateY(110%)}
.hero-title em{font-style:italic;color:var(--gold)}
.hero-desc{font-size:16px;line-height:1.7;color:#5A3E28;max-width:400px;opacity:0;margin-bottom:40px}
.hero-cta-row{display:flex;align-items:center;gap:24px;opacity:0}
.btn-primary{display:inline-flex;align-items:center;gap:10px;background:var(--bark);color:var(--cream);padding:16px 32px;border-radius:50px;font-size:14px;letter-spacing:.08em;font-weight:500;border:none;cursor:pointer;text-decoration:none;transition:background .3s,transform .2s;font-family:var(--ff-b)}
.btn-primary:hover{background:var(--bark2);transform:scale(1.02)}
.btn-primary svg{transition:transform .3s}
.btn-primary:hover svg{transform:translateX(4px)}
.btn-secondary{font-size:14px;letter-spacing:.06em;color:var(--bark2);text-decoration:underline;text-underline-offset:4px;cursor:pointer;background:none;border:none;font-family:var(--ff-b)}
.hero-stats{display:flex;gap:32px;margin-top:48px;opacity:0}
.stat-item{display:flex;flex-direction:column;gap:4px}
.stat-num{font-family:var(--ff-d);font-size:32px;font-weight:400;color:var(--bark)}
.stat-suffix{font-family:var(--ff-d);font-size:32px}
.stat-label{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:var(--gray)}
.stat-div{width:1px;background:rgba(44,26,14,.15)}
.hero-right{position:relative;overflow:hidden}
.hero-img-wrap{position:absolute;inset:0;display:flex;align-items:center;justify-content:flex-end;padding-right:5%}
.hero-img-blob{width:520px;height:620px;background:linear-gradient(145deg,var(--blush2) 0%,var(--cream2) 50%,var(--blush) 100%);border-radius:60% 40% 55% 45%/50% 60% 40% 50%;position:relative;overflow:hidden;transform:scale(0)}
.hero-float{position:absolute;background:var(--white);border-radius:16px;padding:16px 20px;box-shadow:0 8px 32px rgba(44,26,14,.12);opacity:0}
.hero-float-1{top:20%;left:-20px}
.hero-float-2{bottom:25%;right:-10px}
.f-title{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:var(--gray);margin-bottom:4px}
.f-val{font-family:var(--ff-d);font-size:22px;color:var(--bark);font-weight:500}
.f-sub{font-size:11px;color:var(--sage)}
.hero-bg-text{position:absolute;bottom:10%;left:0;font-family:var(--ff-d);font-size:140px;font-weight:300;color:rgba(44,26,14,.04);letter-spacing:-.02em;white-space:nowrap;pointer-events:none;user-select:none}
/* MARQUEE */
.marquee-section{background:var(--bark);padding:14px 0;overflow:hidden}
.marquee-track{display:flex;white-space:nowrap;animation:marquee 22s linear infinite}
.marquee-item{display:inline-flex;align-items:center;gap:24px;padding:0 24px;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--cream);opacity:.7}
.marquee-item .m-dot{color:var(--gold);font-size:18px}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
/* FEATURES */
.features-row{display:grid;grid-template-columns:repeat(4,1fr);background:#2E7D32}
.feat-item{padding:36px 28px;display:flex;align-items:center;gap:16px;border-right:1px solid rgba(255,255,255,.1)}
.feat-item:last-child{border-right:none}
.feat-icon{width:44px;height:44px;background:rgba(56,142,60,.2);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.feat-text h4{font-size:14px;font-weight:600;color:var(--cream);margin-bottom:4px}
.feat-text p{font-size:12px;color:rgba(250,247,242,.5);line-height:1.4}
/* SECTION HEADER */
.section-wrap{padding:100px 5%}
.section-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:60px}
.section-tag{font-size:11px;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);margin-bottom:12px;font-weight:500;display:block}
.section-title{font-family:var(--ff-h);font-size:clamp(32px,4vw,52px);line-height:1.1;font-weight:700}
.section-title em{font-style:italic;color:var(--sage)}
.view-all{display:flex;align-items:center;gap:8px;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--bark);text-decoration:none;font-weight:500;border-bottom:1px solid var(--bark);padding-bottom:2px;cursor:pointer;background:none;border-bottom:1px solid var(--bark);border-top:none;border-left:none;border-right:none;font-family:var(--ff-b)}
/* CATEGORIES */
.cat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.cat-card{position:relative;border-radius:24px;overflow:hidden;cursor:pointer;height:340px;background:var(--cream2)}
.cat-card.wide{grid-column:span 2;height:400px}
.cat-img{width:100%;height:100%;object-fit:cover;transition:transform .7s cubic-bezier(.25,.46,.45,.94)}
.cat-card:hover .cat-img{transform:scale(1.08)}
.cat-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(44,26,14,.7) 0%,transparent 55%)}
.cat-label{position:absolute;bottom:0;left:0;right:0;padding:28px;color:#fff}
.cat-label h3{font-family:var(--ff-h);font-size:26px;font-weight:700;margin-bottom:4px}
.cat-label span{font-size:12px;opacity:.7;letter-spacing:.1em}
.cat-pill{position:absolute;top:20px;right:20px;background:rgba(255,255,255,.18);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.3);color:#fff;padding:6px 14px;border-radius:50px;font-size:11px;letter-spacing:.15em;text-transform:uppercase}
/* PRODUCTS */
.products-section{padding:80px 5%;background:var(--cream2)}
.filter-bar{display:flex;align-items:center;gap:16px;margin-bottom:48px;flex-wrap:wrap}
.filter-chip{padding:10px 22px;border-radius:50px;font-size:13px;letter-spacing:.06em;border:1.5px solid rgba(44,26,14,.2);background:transparent;cursor:pointer;font-family:var(--ff-b);color:var(--bark);transition:all .25s}
.filter-chip.active,.filter-chip:hover{background:var(--bark);color:var(--cream);border-color:var(--bark)}
.sort-select{margin-left:auto;padding:10px 20px;border-radius:50px;border:1.5px solid rgba(44,26,14,.2);background:transparent;font-family:var(--ff-b);font-size:13px;color:var(--bark);cursor:pointer;outline:none}
.prod-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.prod-card{background:var(--white);border-radius:20px;overflow:hidden;cursor:pointer;position:relative;transition:transform .3s,box-shadow .3s}
.prod-card:hover{transform:translateY(-6px);box-shadow:0 20px 60px rgba(44,26,14,.12)}
.prod-img-wrap{position:relative;overflow:hidden;aspect-ratio:1/1;background:var(--cream2)}
.prod-img-wrap img{width:100%;height:100%;object-fit:cover;transition:transform .5s cubic-bezier(.25,.46,.45,.94)}
.prod-card:hover .prod-img-wrap img{transform:scale(1.08)}
.prod-badge{position:absolute;top:14px;left:14px;background:var(--sage);color:#fff;font-size:10px;letter-spacing:.15em;text-transform:uppercase;padding:5px 10px;border-radius:50px;font-weight:600;pointer-events:none}
.prod-badge.hot{background:var(--gold)}
.prod-badge.new{background:var(--blush);color:var(--bark)}
.prod-badge.sale{background:var(--sage)}
.prod-wish{position:absolute;top:14px;right:14px;width:36px;height:36px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;border:none;cursor:pointer;opacity:0;transform:translateY(-8px);transition:all .3s;box-shadow:0 2px 12px rgba(0,0,0,.1)}
.prod-card:hover .prod-wish{opacity:1;transform:translateY(0)}
.prod-quick{position:absolute;bottom:0;left:0;right:0;background:var(--bark);color:var(--cream);padding:14px;text-align:center;font-size:12px;letter-spacing:.15em;text-transform:uppercase;transform:translateY(100%);transition:transform .35s cubic-bezier(.25,.46,.45,.94);border:none;cursor:pointer;font-family:var(--ff-b)}
.prod-card:hover .prod-quick{transform:translateY(0)}
.prod-info{padding:18px 16px}
.prod-brand{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--sage);margin-bottom:6px;font-weight:600}
.prod-name{font-size:15px;font-weight:500;color:var(--bark);margin-bottom:10px;line-height:1.3}
.prod-stars-row{display:flex;align-items:center;gap:4px;margin-bottom:10px}
.stars{color:var(--gold);font-size:12px;letter-spacing:1px}
.reviews-count{font-size:11px;color:var(--gray);margin-left:4px}
.prod-price-row{display:flex;align-items:center;gap:8px}
.prod-price{font-family:var(--ff-d);font-size:22px;font-weight:500;color:var(--bark)}
.prod-orig{font-size:13px;text-decoration:line-through;color:var(--gray)}
.prod-disc{font-size:11px;font-weight:600;color:var(--sage);background:var(--blush2);padding:2px 8px;border-radius:50px}
.prod-add{width:32px;height:32px;background:var(--bark);border:none;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;margin-left:auto;transition:background .25s,transform .2s}
.prod-add:hover{background:var(--gold);transform:scale(1.1)}
/* OFFER */
.offer-banner{margin:80px 5%;background:var(--bark);border-radius:32px;padding:60px;display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;position:relative;overflow:hidden}
.offer-banner::before{content:'';position:absolute;right:-80px;top:-80px;width:360px;height:360px;border-radius:50%;background:rgba(201,151,58,.12);pointer-events:none}
.offer-banner::after{content:'';position:absolute;left:-40px;bottom:-60px;width:240px;height:240px;border-radius:50%;background:rgba(92,122,95,.08);pointer-events:none}
.offer-tag{font-size:11px;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);margin-bottom:16px}
.offer-title{font-family:var(--ff-h);font-size:clamp(28px,3.5vw,48px);color:var(--cream);font-weight:700;line-height:1.1;margin-bottom:16px}
.offer-desc{font-size:15px;color:rgba(250,247,242,.6);line-height:1.6;margin-bottom:32px}
.offer-code{display:inline-flex;align-items:center;gap:12px;background:rgba(255,255,255,.08);border:1px dashed rgba(255,255,255,.3);border-radius:12px;padding:14px 20px;margin-bottom:32px}
.offer-code .oc-label{font-size:12px;color:rgba(250,247,242,.5);letter-spacing:.1em;text-transform:uppercase}
.offer-code .oc-code{font-family:var(--ff-d);font-size:24px;color:var(--gold);font-weight:500;letter-spacing:.1em}
.timer-row{display:flex;gap:20px;align-items:flex-start}
.timer-box{text-align:center}
.timer-num{font-family:var(--ff-d);font-size:36px;color:var(--cream);font-weight:400}
.timer-label{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:rgba(250,247,242,.4)}
.timer-sep{font-family:var(--ff-d);font-size:30px;color:var(--gold);padding-top:8px}
.offer-img{border-radius:20px;overflow:hidden;height:300px}
.offer-img img{width:100%;height:100%;object-fit:cover}
/* INGREDIENTS */
.ingredients-section{padding:100px 5%;text-align:center}
.ingr-intro{max-width:600px;margin:0 auto 64px}
.ingr-intro p{font-size:16px;color:#5A3E28;line-height:1.7;margin-top:16px}
.ingr-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:24px}
.ingr-card{background:var(--cream2);border-radius:20px;padding:36px 20px;text-align:center;transition:transform .3s,background .3s;cursor:default}
.ingr-card:hover{background:var(--bark);transform:translateY(-4px)}
.ingr-card:hover .ingr-name,.ingr-card:hover .ingr-desc{color:var(--cream)}
.ingr-icon{font-size:44px;margin-bottom:16px;display:block}
.ingr-name{font-family:var(--ff-d);font-size:20px;font-weight:500;color:var(--bark);margin-bottom:8px;transition:color .3s}
.ingr-desc{font-size:13px;color:var(--gray);line-height:1.5;transition:color .3s}
/* TESTIMONIALS */
.testi-section{padding:100px 5%;background:var(--blush2)}
.testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:60px}
.testi-card{background:#fff;border-radius:20px;padding:32px}
.testi-quote{font-family:var(--ff-d);font-size:72px;color:var(--blush);line-height:.7;margin-bottom:16px;font-weight:400}
.testi-text{font-size:15px;line-height:1.7;color:var(--bark2);margin-bottom:24px;font-style:italic}
.testi-stars{color:var(--gold);font-size:13px;margin-bottom:4px}
.testi-user{display:flex;align-items:center;gap:12px}
.testi-avatar{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--ff-d);font-weight:500;font-size:18px;flex-shrink:0}
.t-name{font-size:14px;font-weight:600;color:var(--bark)}
.t-role{font-size:12px;color:var(--gray)}
.verified{font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--sage);font-weight:600}
/* NEWSLETTER */
.newsletter{margin:0 5% 80px;background:var(--sage);border-radius:32px;padding:64px;text-align:center;position:relative;overflow:hidden}
.newsletter::before{content:'';position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1611125532756-d073acfb5e6b?w=1200&q=60') center/cover;opacity:.12;pointer-events:none}
.newsletter-content{position:relative;z-index:1}
.newsletter h2{font-family:var(--ff-h);font-size:clamp(28px,3.5vw,46px);color:var(--cream);margin-bottom:12px}
.newsletter p{font-size:16px;color:rgba(250,247,242,.75);margin-bottom:36px}
.nl-form{display:flex;gap:12px;max-width:480px;margin:0 auto}
.nl-form input{flex:1;padding:16px 24px;border-radius:50px;border:none;background:rgba(255,255,255,.15);color:var(--cream);font-family:var(--ff-b);font-size:14px;backdrop-filter:blur(8px);outline:none}
.nl-form input::placeholder{color:rgba(250,247,242,.5)}
.nl-form button{padding:16px 32px;border-radius:50px;background:var(--gold);color:var(--bark);border:none;font-family:var(--ff-b);font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;transition:background .25s,transform .2s}
.nl-form button:hover{background:var(--gold2);transform:scale(1.02)}
/* FOOTER */
.footer{background:var(--bark);padding:80px 5% 40px;color:var(--cream)}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;margin-bottom:60px}
.footer-logo{font-family:var(--ff-d);font-size:36px;font-weight:300;letter-spacing:.08em;margin-bottom:16px}
.footer-logo span{color:var(--gold)}
.footer-about{font-size:14px;color:rgba(250,247,242,.55);line-height:1.7;max-width:280px;margin-bottom:28px}
.social-row{display:flex;gap:12px}
.social-btn{width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .25s,border-color .25s;background:transparent}
.social-btn:hover{background:var(--gold);border-color:var(--gold)}
.footer-col h4{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:rgba(250,247,242,.4);margin-bottom:20px;font-weight:500}
.footer-col ul{list-style:none;display:flex;flex-direction:column;gap:12px}
.footer-col a{font-size:14px;color:rgba(250,247,242,.65);text-decoration:none;transition:color .25s}
.footer-col a:hover{color:var(--gold)}
.footer-bottom{border-top:1px solid rgba(255,255,255,.08);padding-top:32px;display:flex;align-items:center;justify-content:space-between}
.footer-bottom p{font-size:12px;color:rgba(250,247,242,.35)}
.payment-icons{display:flex;gap:12px}
.pay-icon{background:rgba(255,255,255,.08);border-radius:6px;padding:4px 10px;font-size:11px;font-weight:600;color:rgba(250,247,242,.5)}
/* CART SIDEBAR */
.cart-sidebar{position:fixed;right:0;top:0;bottom:0;width:420px;background:#fff;z-index:900;transform:translateX(100%);transition:transform .45s cubic-bezier(.25,.46,.45,.94);box-shadow:-20px 0 60px rgba(44,26,14,.15);display:flex;flex-direction:column}
.cart-sidebar.open{transform:translateX(0)}
.cart-overlay-bg{position:fixed;inset:0;background:rgba(44,26,14,.4);z-index:899;backdrop-filter:blur(3px)}
.cart-head{padding:28px 28px 20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(44,26,14,.1)}
.cart-head h2{font-family:var(--ff-h);font-size:22px;font-weight:700}
.close-btn{width:36px;height:36px;border:1px solid rgba(44,26,14,.15);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;background:transparent;transition:background .25s}
.close-btn:hover{background:var(--cream)}
.cart-items{flex:1;overflow-y:auto;padding:20px 28px}
.cart-empty{text-align:center;color:var(--gray);margin-top:60px;font-size:14px}
.cart-item{display:flex;gap:16px;padding:16px 0;border-bottom:1px solid rgba(44,26,14,.07)}
.ci-img{width:72px;height:72px;border-radius:12px;object-fit:cover;background:var(--cream2);flex-shrink:0}
.ci-info{flex:1}
.ci-name{font-size:14px;font-weight:500;color:var(--bark);margin-bottom:4px}
.ci-var{font-size:12px;color:var(--gray);margin-bottom:10px}
.ci-qty{display:flex;align-items:center;gap:10px}
.qty-btn{width:28px;height:28px;border:1px solid rgba(44,26,14,.2);border-radius:50%;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;transition:background .2s;line-height:1}
.qty-btn:hover{background:var(--cream2)}
.ci-remove{margin-left:auto;background:none;border:none;cursor:pointer;color:var(--gray);font-size:12px;font-family:var(--ff-b)}
.ci-price{font-family:var(--ff-d);font-size:20px;color:var(--bark);align-self:flex-start;margin-top:4px}
.cart-foot{padding:20px 28px 28px;border-top:1px solid rgba(44,26,14,.1)}
.cart-subtotal{display:flex;justify-content:space-between;margin-bottom:8px}
.cart-subtotal span:first-child{font-size:13px;color:var(--gray)}
.cart-subtotal-val{font-family:var(--ff-d);font-size:20px;color:var(--bark)}
.free-ship{font-size:12px;color:var(--sage);margin-bottom:20px;display:flex;align-items:center;gap:6px}
.checkout-btn{width:100%;padding:18px;background:var(--bark);color:var(--cream);border:none;border-radius:16px;font-family:var(--ff-b);font-size:15px;font-weight:600;cursor:pointer;letter-spacing:.05em;transition:background .25s;margin-bottom:12px}
.checkout-btn:hover{background:var(--bark2)}
.gpay-btn{width:100%;padding:16px;background:var(--cream);border:1.5px solid rgba(44,26,14,.15);border-radius:16px;font-family:var(--ff-b);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;color:var(--bark);transition:background .2s}
.gpay-btn:hover{background:var(--cream2)}
/* MODAL */
.modal-overlay-wrap{position:fixed;inset:0;z-index:850;display:flex;align-items:center;justify-content:center;padding:24px}
.modal-bg{position:absolute;inset:0;background:rgba(44,26,14,.5);backdrop-filter:blur(6px)}
.modal-box{position:relative;z-index:1;background:#fff;border-radius:28px;width:100%;max-width:860px;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;transform:scale(.95) translateY(20px);transition:transform .4s cubic-bezier(.34,1.2,.64,1)}
.modal-open .modal-box{transform:scale(1) translateY(0)}
.modal-imgs{background:var(--cream2);padding:32px}
.modal-imgs img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:16px;margin-bottom:12px}
.modal-thumbs{display:flex;gap:10px}
.thumb{width:60px;height:60px;border-radius:10px;object-fit:cover;cursor:pointer;border:2px solid transparent;transition:border-color .2s}
.thumb.active{border-color:var(--gold)}
.modal-info{padding:40px 32px;display:flex;flex-direction:column;overflow-y:auto;max-height:80vh}
.modal-brand{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--sage);font-weight:600;margin-bottom:8px}
.modal-name{font-family:var(--ff-h);font-size:26px;font-weight:700;color:var(--bark);margin-bottom:12px;line-height:1.2}
.modal-rating{display:flex;align-items:center;gap:8px;margin-bottom:20px}
.modal-price-row{display:flex;align-items:baseline;gap:12px;margin-bottom:24px;flex-wrap:wrap}
.modal-price{font-family:var(--ff-d);font-size:36px;color:var(--bark)}
.modal-orig{font-size:16px;text-decoration:line-through;color:var(--gray)}
.modal-disc-badge{background:var(--blush2);color:var(--gold);font-size:13px;font-weight:600;padding:4px 12px;border-radius:50px}
.modal-desc{font-size:14px;color:#5A3E28;line-height:1.7;margin-bottom:24px}
.modal-label{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:var(--gray);margin-bottom:10px;font-weight:500}
.size-opts{display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap}
.size-btn{padding:8px 18px;border:1.5px solid rgba(44,26,14,.2);border-radius:50px;font-size:13px;cursor:pointer;background:transparent;font-family:var(--ff-b);transition:all .2s}
.size-btn.active{background:var(--bark);color:var(--cream);border-color:var(--bark)}
.qty-row{display:flex;align-items:center;gap:16px;margin-bottom:28px}
.qty-ctrl{display:flex;align-items:center;gap:12px;border:1.5px solid rgba(44,26,14,.2);border-radius:50px;padding:6px 16px}
.qty-ctrl button{background:none;border:none;cursor:pointer;font-size:20px;color:var(--bark);font-weight:300;line-height:1;padding:0}
.qty-ctrl span{font-size:16px;font-weight:500;min-width:24px;text-align:center}
.modal-add-row{display:flex;gap:12px}
.modal-add{flex:1;padding:16px;background:var(--bark);color:var(--cream);border:none;border-radius:16px;font-family:var(--ff-b);font-size:14px;font-weight:600;cursor:pointer;transition:background .25s}
.modal-add:hover{background:var(--bark2)}
.modal-wish-btn{width:52px;height:52px;border:1.5px solid rgba(44,26,14,.2);border-radius:16px;display:flex;align-items:center;justify-content:center;cursor:pointer;background:transparent;transition:background .25s;flex-shrink:0}
.modal-wish-btn:hover{background:var(--blush2)}
.modal-close{position:absolute;top:20px;right:20px;width:36px;height:36px;border-radius:50%;background:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2;box-shadow:0 2px 12px rgba(0,0,0,.1)}
/* TOAST */
.toast{position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--bark);color:var(--cream);padding:14px 24px;border-radius:50px;font-size:13px;font-weight:500;z-index:9999;opacity:0;transition:all .4s cubic-bezier(.34,1.56,.64,1);display:flex;align-items:center;gap:10px;box-shadow:0 8px 32px rgba(0,0,0,.2);pointer-events:none}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
.toast-check{width:20px;height:20px;background:var(--sage);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
/* REVEAL UTILITY */
.reveal{opacity:0;transform:translateY(32px)}
.revealed{opacity:1;transform:translateY(0);transition:opacity .8s ease,transform .8s ease}
/* ─── TABLET (769px - 1024px) ─── */
@media(max-width:1024px){
  .prod-grid{grid-template-columns:repeat(3,1fr)}
  .cat-grid{grid-template-columns:repeat(2,1fr)}
  .cat-card.wide{grid-column:span 2}
  .ingr-grid{grid-template-columns:repeat(3,1fr)}
  .footer-grid{grid-template-columns:1fr 1fr;gap:32px}
  .hero-title{font-size:clamp(36px,4.5vw,60px)}
  .hero-desc{max-width:360px}
  .section-wrap{padding:80px 5%}
  .newsletter{padding:48px}
  .offer-banner{padding:48px}
  .modal-info{padding:32px 24px}
}

/* ─── MOBILE LANDSCAPE / SMALL TABLET (601px - 768px) ─── */
@media(max-width:768px){
  .hero{grid-template-columns:1fr;height:auto;min-height:auto;padding:100px 5% 60px}
  .hero-left{padding:0}
  .hero-right{display:none}
  .hero-title{font-size:clamp(32px,6vw,48px)}
  .hero-stats{gap:24px;flex-wrap:wrap}
  .hero-cta-row{flex-wrap:wrap}
  .prod-grid{grid-template-columns:repeat(2,1fr);gap:16px}
  .testi-grid{grid-template-columns:1fr}
  .offer-banner{grid-template-columns:1fr;padding:32px}
  .offer-img{display:none}
  .modal-box{grid-template-columns:1fr;max-height:90vh}
  .modal-imgs{display:none}
  .modal-info{padding:28px 20px}
  .cart-sidebar{width:100%;max-width:100%}
  .features-row{grid-template-columns:1fr 1fr}
  .feat-item{padding:24px 20px}
  .ingr-grid{grid-template-columns:repeat(2,1fr);gap:16px}
  .nav-links{display:none}
  .nav-search-box input{width:100px}
  .section-wrap{padding:60px 5%}
  .section-header{margin-bottom:40px}
  .section-title{font-size:clamp(26px,4vw,36px)}
  .cat-grid{grid-template-columns:1fr 1fr;gap:12px}
  .cat-card{height:260px}
  .cat-card.wide{grid-column:span 2;height:280px}
  .filter-bar{gap:10px}
  .filter-chip{padding:8px 16px;font-size:12px}
  .newsletter{margin:0 4% 40px;padding:40px 24px;border-radius:24px}
  .newsletter h2{font-size:24px}
  .nl-form{flex-direction:column}
  .nl-form input,.nl-form button{width:100%}
  .footer-grid{grid-template-columns:1fr 1fr;gap:24px}
  .footer-about{max-width:100%}
  .ingr-card{padding:24px 16px}
  .ingr-icon{font-size:36px}
  .ingr-name{font-size:18px}
  .testi-card{padding:24px}
  .toast{bottom:16px;left:16px;right:16px;transform:translateY(100px);font-size:12px}
  .toast.show{transform:translateY(0)}
}

/* ─── SMALL MOBILE (480px and below) ─── */
@media(max-width:480px){
  .dsa-nav{height:60px;padding:0 4%}
  .nav-logo{font-size:22px}
  .nav-search-box{display:none}
  .nav-right{gap:14px}
  .hero{padding:80px 4% 40px}
  .hero-title{font-size:28px}
  .hero-desc{font-size:14px;margin-bottom:28px}
  .hero-badge{margin-bottom:20px;padding:5px 12px}
  .hero-badge span{font-size:10px}
  .hero-stats{gap:16px}
  .stat-num{font-size:24px}
  .stat-label{font-size:10px}
  .btn-primary{padding:12px 24px;font-size:13px}
  .prod-grid{grid-template-columns:1fr 1fr;gap:12px}
  .prod-info{padding:12px}
  .prod-name{font-size:13px}
  .prod-price{font-size:18px}
  .prod-add{width:28px;height:28px}
  .features-row{grid-template-columns:1fr 1fr}
  .feat-item{padding:16px 12px;gap:10px}
  .feat-icon{width:36px;height:36px}
  .feat-text h4{font-size:12px}
  .feat-text p{font-size:11px}
  .cat-grid{grid-template-columns:1fr}
  .cat-card{height:200px}
  .cat-card.wide{grid-column:span 1;height:200px}
  .cat-label h3{font-size:20px}
  .section-wrap{padding:40px 4%}
  .section-title{font-size:24px}
  .offer-banner{margin:40px 4%;padding:24px;border-radius:20px}
  .offer-title{font-size:24px}
  .offer-desc{font-size:13px}
  .timer-row{gap:12px}
  .timer-num{font-size:24px}
  .ingr-grid{grid-template-columns:1fr 1fr;gap:10px}
  .ingr-card{padding:20px 12px}
  .ingr-icon{font-size:32px}
  .ingr-name{font-size:16px}
  .ingr-desc{font-size:12px}
  .testi-grid{gap:16px}
  .testi-quote{font-size:48px}
  .testi-text{font-size:13px}
  .newsletter{margin:0 4% 32px;padding:32px 16px;border-radius:20px}
  .newsletter p{font-size:14px}
  .footer{padding:40px 4% 24px}
  .footer-grid{grid-template-columns:1fr;gap:24px}
  .footer-about{max-width:100%}
  .footer-bottom{flex-direction:column;gap:16px;text-align:center}
  .cart-sidebar{width:100%}
  .cart-head{padding:20px}
  .cart-items{padding:16px}
  .cart-item{gap:12px}
  .ci-img{width:60px;height:60px}
  .modal-box{border-radius:20px;max-height:85vh}
  .modal-info{padding:20px 16px}
  .modal-name{font-size:22px}
  .modal-price{font-size:28px}
  .qty-ctrl{padding:4px 12px}
  .modal-add{padding:14px}
}

/* ═══════════════════════════════════════════
   ADMIN PANEL STYLES
═══════════════════════════════════════════ */
.admin-page{min-height:100vh;background:var(--cream);padding:20px 5% 60px}
.admin-header{display:flex;align-items:center;justify-content:space-between;padding:20px 0;border-bottom:1px solid rgba(44,26,14,.1);margin-bottom:32px}
.admin-header-left{display:flex;align-items:center;gap:24px}
.admin-back-btn{display:inline-flex;align-items:center;gap:8px;background:none;border:none;font-family:var(--ff-b);font-size:14px;color:var(--bark);cursor:pointer;opacity:.7;transition:opacity .2s}
.admin-back-btn:hover{opacity:1}
.admin-title{font-family:var(--ff-h);font-size:32px;color:var(--bark);font-weight:700}
.admin-logout-btn{padding:10px 24px;background:transparent;border:1.5px solid #c0392b;border-radius:12px;font-family:var(--ff-b);font-size:13px;color:#c0392b;cursor:pointer;font-weight:600;transition:all .25s}
.admin-logout-btn:hover{background:#c0392b;color:#fff}

/* Stats */
.admin-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:32px}
.admin-stat-card{background:#fff;border-radius:20px;padding:28px 24px;text-align:center;box-shadow:0 4px 20px rgba(44,26,14,.06)}
.admin-stat-icon{font-size:28px;margin-bottom:8px}
.admin-stat-num{font-family:var(--ff-d);font-size:36px;color:var(--bark);font-weight:500}
.admin-stat-label{font-size:12px;letter-spacing:.15em;text-transform:uppercase;color:var(--gray);margin-top:4px}

/* Tabs */
.admin-tabs{display:flex;gap:8px;margin-bottom:32px;flex-wrap:wrap}
.admin-tab{padding:12px 24px;border-radius:50px;font-size:13px;letter-spacing:.06em;border:1.5px solid rgba(44,26,14,.15);background:transparent;cursor:pointer;font-family:var(--ff-b);color:var(--bark);transition:all .25s;display:flex;align-items:center;gap:8px}
.admin-tab.active,.admin-tab:hover{background:var(--bark);color:var(--cream);border-color:var(--bark)}

/* Content */
.admin-content{background:#fff;border-radius:24px;padding:32px;box-shadow:0 4px 20px rgba(44,26,14,.06)}
.admin-section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}
.admin-section-header h2{font-family:var(--ff-h);font-size:24px;color:var(--bark)}
.admin-add-btn{padding:10px 24px;background:var(--bark);color:var(--cream);border:none;border-radius:12px;font-family:var(--ff-b);font-size:13px;font-weight:600;cursor:pointer;transition:background .25s}
.admin-add-btn:hover{background:var(--bark2)}

/* Form */
.admin-form{background:var(--cream);border-radius:20px;padding:28px;margin-bottom:28px;border:1px solid rgba(44,26,14,.08)}
.admin-form h3{font-family:var(--ff-h);font-size:20px;color:var(--bark);margin-bottom:20px}
.admin-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.admin-field{display:flex;flex-direction:column;gap:6px}
.admin-field.full-width{grid-column:1/-1}
.admin-field label{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--bark);font-weight:600}
.admin-field input,.admin-field select,.admin-field textarea{padding:12px 14px;border:1.5px solid rgba(44,26,14,.12);border-radius:10px;background:#fff;font-family:var(--ff-b);font-size:14px;color:var(--bark);transition:border-color .2s;outline:none}
.admin-field input:focus,.admin-field select:focus,.admin-field textarea:focus{border-color:var(--gold)}
.admin-field textarea{resize:vertical;min-height:80px}
.admin-form-actions{display:flex;gap:12px;margin-top:20px}
.admin-save-btn{padding:12px 28px;background:var(--bark);color:var(--cream);border:none;border-radius:12px;font-family:var(--ff-b);font-size:14px;font-weight:600;cursor:pointer;transition:background .25s}
.admin-save-btn:hover{background:var(--bark2)}
.admin-cancel-btn{padding:12px 28px;background:transparent;border:1.5px solid rgba(44,26,14,.2);border-radius:12px;font-family:var(--ff-b);font-size:14px;color:var(--bark);cursor:pointer;transition:all .25s}
.admin-cancel-btn:hover{background:rgba(44,26,14,.05)}

/* Table */
.admin-table-wrap{overflow-x:auto}
.admin-table{width:100%;border-collapse:collapse}
.admin-table th{text-align:left;font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:var(--gray);font-weight:600;padding:12px 16px;border-bottom:2px solid rgba(44,26,14,.08)}
.admin-table td{padding:14px 16px;border-bottom:1px solid rgba(44,26,14,.05);font-size:14px;vertical-align:middle}
.admin-table-img{width:50px;height:50px;border-radius:10px;object-fit:cover}
.admin-edit-btn{padding:6px 16px;background:var(--blush2);color:var(--bark);border:none;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;margin-right:8px;transition:background .2s}
.admin-edit-btn:hover{background:var(--blush)}
.admin-delete-btn{padding:6px 16px;background:rgba(192,57,43,.1);color:#c0392b;border:none;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;transition:background .2s}
.admin-delete-btn:hover{background:rgba(192,57,43,.2)}

/* Review cards */
.admin-review-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px}
.admin-review-card{background:var(--cream);border-radius:16px;padding:24px;position:relative}
.admin-review-quote{font-family:var(--ff-d);font-size:48px;color:var(--blush);line-height:.7;margin-bottom:12px}
.admin-review-text{font-size:14px;color:var(--bark2);line-height:1.6;margin-bottom:16px;font-style:italic}
.admin-review-meta{display:flex;align-items:center;gap:12px}
.admin-review-avatar{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--ff-d);font-weight:500;font-size:16px;flex-shrink:0}

/* UPI display */
.admin-upi-display{margin-top:20px;padding:16px;background:var(--blush2);border-radius:12px;display:flex;align-items:center;gap:12px;font-size:14px}

/* Order status */
.admin-order-status{padding:4px 12px;border-radius:50px;font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase}
.admin-order-status.pending{background:rgba(243,156,18,.15);color:#e67e22}
.admin-order-status.delivered{background:rgba(46,204,113,.15);color:#27ae60}
.admin-order-status.shipped{background:rgba(52,152,219,.15);color:#2980b9}

/* Change log */
.admin-log-list{display:flex;flex-direction:column;gap:12px}
.admin-log-item{display:flex;align-items:flex-start;gap:16px;padding:16px;background:var(--cream);border-radius:12px}
.admin-log-badge{width:40px;height:40px;background:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.admin-log-content{flex:1}
.admin-log-content strong{font-size:14px;color:var(--bark);display:block;margin-bottom:2px}
.admin-log-content p{font-size:13px;color:var(--gray);margin:0}
.admin-log-time{font-size:12px;color:var(--gray);white-space:nowrap}

/* Empty state */
.admin-empty{text-align:center;padding:60px 20px;color:var(--gray);font-size:15px}

/* Admin login error */
.admin-login-error{background:rgba(192,57,43,.1);color:#c0392b;padding:12px 16px;border-radius:10px;font-size:13px;margin-bottom:16px;text-align:center}

/* Admin responsive */
@media(max-width:1024px){
  .admin-stats{grid-template-columns:repeat(2,1fr)}
  .admin-form-grid{grid-template-columns:1fr}
  .admin-field.full-width{grid-column:auto}
}
@media(max-width:768px){
  .admin-page{padding:16px 4% 40px}
  .admin-header{flex-direction:column;gap:16px;align-items:flex-start}
  .admin-title{font-size:24px}
  .admin-tabs{gap:6px}
  .admin-tab{padding:10px 16px;font-size:12px}
  .admin-content{padding:20px 16px}
  .admin-review-list{grid-template-columns:1fr}
  .admin-log-item{flex-direction:column;gap:8px}
  .admin-log-time{align-self:flex-end}
}
@media(max-width:480px){
  .admin-stats{grid-template-columns:1fr 1fr;gap:12px}
  .admin-stat-card{padding:20px 16px}
  .admin-stat-num{font-size:28px}
  .admin-form{padding:20px 16px}
  .admin-table th,.admin-table td{padding:10px 8px;font-size:12px}
  .admin-table-img{width:36px;height:36px}
}
`;

/* ═══════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════ */



/* Loader replaced by SplashScreen component (./components/SplashScreen.jsx) */

function Navbar({ cartCount, onCartOpen, onFilterCategory, searchQuery, onSearch, onLoginClick }) {
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

function useReveal(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { e.target.classList.add("revealed"); obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
}

function useCounter(ref, target) {
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { animateCounter(ref.current, target, 2000); obs.disconnect(); }
    }, { threshold: 0.5 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, target]);
}

function Hero({ onShop, onFilterCategory }) {
  const badgeRef = useRef(null);
  const word1 = useRef(null), word2 = useRef(null), word3 = useRef(null), word4 = useRef(null), word5 = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const blobRef = useRef(null);
  const float1Ref = useRef(null);
  const float2Ref = useRef(null);
  const bgRef = useRef(null);
  const stat1 = useRef(null), stat2 = useRef(null), stat3 = useRef(null);
  useCounter(stat1, 50);
  useCounter(stat2, 10000);
  useCounter(stat3, 100);

  useEffect(() => {
    loadGSAP().then(() => {
      const gsap = window.gsap;
      const tl = gsap.timeline({ delay: 2.2 });
      tl.to(badgeRef.current, { opacity: 1, y: 0, duration: .6, ease: "back.out(1.5)" })
        .to([word1.current, word2.current, word3.current, word4.current, word5.current], { y: "0%", duration: .9, stagger: .08, ease: "power4.out" }, "-=.4")
        .to(descRef.current, { opacity: 1, y: 0, duration: .6 }, "-=.3")
        .to(ctaRef.current, { opacity: 1, y: 0, duration: .6 }, "-=.4")
        .to(statsRef.current, { opacity: 1, y: 0, duration: .6 }, "-=.3")
        .to(blobRef.current, { scale: 1, duration: 1.0, ease: "back.out(1.2)" }, "-=.8")
        .to([float1Ref.current, float2Ref.current], { opacity: 1, y: 0, duration: .6, stagger: .2, ease: "back.out(1.5)" }, "-=.6");

      // Parallax mouse
      const onMove = (e) => {
        const rx = (e.clientX / window.innerWidth - .5) * 12;
        const ry = (e.clientY / window.innerHeight - .5) * 8;
        gsap.to(float1Ref.current, { x: rx * .6, y: ry * .4, duration: .8, ease: "power2.out" });
        gsap.to(float2Ref.current, { x: rx * 1.2, y: ry * .8, duration: .8, ease: "power2.out" });
        gsap.to(bgRef.current, { x: rx * 3, duration: 1.2, ease: "power2.out" });
      };
      window.addEventListener("mousemove", onMove);
      return () => window.removeEventListener("mousemove", onMove);
    });
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero-left">
        <div className="hero-badge" ref={badgeRef}><span>100% Natural Ingredients</span></div>
        <h1 className="hero-title">
          <span className="line"><span className="word" ref={word1}>Nature's</span></span>
          <span className="line"><span className="word" ref={word2}><em>Finest</em></span>&nbsp;<span className="word" ref={word3}>Care</span></span>
          <span className="line"><span className="word" ref={word4}>For</span>&nbsp;<span className="word" ref={word5}>You</span></span>
        </h1>
        <p className="hero-desc" ref={descRef}>Discover the power of pure botanical ingredients. Our formulas are crafted to nourish, heal, and illuminate your hair &amp; skin naturally.</p>
        <div className="hero-cta-row" ref={ctaRef}>
          <button className="btn-primary" onClick={onShop}>
            Shop Now
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
          </button>
          <button className="btn-secondary" onClick={() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })}>Explore Collections</button>
        </div>
        <div className="hero-stats" ref={statsRef}>
          <div className="stat-item">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span className="stat-num" ref={stat1}>0</span>
              <span className="stat-suffix">+</span>
            </div>
            <span className="stat-label">Products</span>
          </div>
          <div className="stat-div" />
          <div className="stat-item">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span className="stat-num" ref={stat2}>0</span>
              <span className="stat-suffix">+</span>
            </div>
            <span className="stat-label">Happy Customers</span>
          </div>
          <div className="stat-div" />
          <div className="stat-item">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span className="stat-num" ref={stat3}>0</span>
              <span className="stat-suffix">%</span>
            </div>
            <span className="stat-label">Natural</span>
          </div>
        </div>
        <div className="hero-bg-text" ref={bgRef}>DSA Naturals</div>
      </div>
      <div className="hero-right">
        <div className="hero-img-wrap">
          <div className="hero-img-blob" ref={blobRef}>
            <img src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80" alt="Natural skincare" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
          </div>
        </div>
        <div className="hero-float hero-float-1" ref={float1Ref}>
          <div className="f-title">Best Seller</div>
          <div className="f-val">Argan Oil</div>
          <div className="f-sub">★★★★★ 4.9</div>
        </div>
        <div className="hero-float hero-float-2" ref={float2Ref}>
          <div className="f-title">Today's Offer</div>
          <div className="f-val">30% Off</div>
          <div className="f-sub">Hair Care Range</div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="marquee-section">
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={i} className="marquee-item">{item}<span className="m-dot">✦</span></span>
        ))}
      </div>
    </div>
  );
}

function Features() {
  const features = [
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#388E3C" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>, title: "Free Delivery", sub: "On orders above ₹599" },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#388E3C" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>, title: "7-Day Returns", sub: "Hassle-free return policy" },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#388E3C" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" /></svg>, title: "100% Natural", sub: "No harmful chemicals" },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#388E3C" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.77 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.68 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.66a16 16 0 0 0 6 6l1.02-1.02a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>, title: "24/7 Support", sub: "Expert care always available" },
  ];
  return (
    <div className="features-row">
      {features.map((f, i) => (
        <div className="feat-item" key={i}>
          <div className="feat-icon">{f.icon}</div>
          <div className="feat-text"><h4>{f.title}</h4><p>{f.sub}</p></div>
        </div>
      ))}
    </div>
  );
}

function Categories({ onFilterCategory }) {
  const ref = useRef(null);
  useReveal(ref);
  return (
    <section className="section-wrap" id="categories">
      <div className="section-header reveal" ref={ref}>
        <div>
          <span className="section-tag">Explore</span>
          <h2 className="section-title">Our <em>Collections</em></h2>
        </div>
        <button className="view-all" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>View All →</button>
      </div>
      <div className="cat-grid">
        {CATEGORIES.map((cat, i) => (
          <div key={i} className={`cat-card${cat.span === 2 ? " wide" : ""}`} onClick={() => onFilterCategory(cat.name)}>
            <img className="cat-img" src={cat.img} alt={cat.name} loading="lazy" />
            <div className="cat-overlay" />
            <div className="cat-label"><h3>{cat.name}</h3><span>{cat.count} Products</span></div>
            {cat.pill && <span className="cat-pill">{cat.pill}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}

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

function Products({ products: productsProp, filter, onFilterChange, searchQuery, onAddToCart, onOpenModal, wishlist, onToggleWish }) {
  const [sort, setSort] = useState("default");
  const FILTERS = ["All", "Hair Care", "Skin Care", "Oils", "Masks"];
  const productList = productsProp || PRODUCTS;

  const filtered = (() => {
    let arr = [...productList];
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

function OfferBanner() {
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

function Ingredients() {
  const ref = useRef(null);
  useReveal(ref);
  return (
    <section className="ingredients-section" id="ingredients">
      <div className="ingr-intro reveal" ref={ref}>
        <span className="section-tag">Pure Ingredients</span>
        <h2 className="section-title">Powered by <em>Nature</em></h2>
        <p>Every formula begins with the finest botanical ingredients, ethically sourced and scientifically backed.</p>
      </div>
      <div className="ingr-grid">
        {INGREDIENTS.map((ing, i) => (
          <div key={i} className="ingr-card">
            <span className="ingr-icon">{ing.icon}</span>
            <div className="ingr-name">{ing.name}</div>
            <div className="ingr-desc">{ing.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials({ testimonials: testimonialsProp }) {
  const ref = useRef(null);
  useReveal(ref);
  const list = testimonialsProp || TESTIMONIALS;
  return (
    <section className="testi-section" id="testimonials">
      <div className="reveal" ref={ref} style={{ textAlign: "center" }}>
        <span className="section-tag">Reviews</span>
        <h2 className="section-title">What Our <em>Customers</em> Say</h2>
      </div>
      <div className="testi-grid">
        {list.map((t, i) => (
          <div key={i} className="testi-card">
            <div className="testi-quote">"</div>
            <p className="testi-text">{t.text}</p>
            <div className="testi-stars">★★★★★</div>
            <div className="testi-user">
              <div className="testi-avatar" style={{ background: t.color, color: t.textColor }}>{t.name[0]}</div>
              <div>
                <div className="t-name">{t.name}</div>
                <div className="t-role">{t.role} · <span className="verified">✓ Verified</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const ref = useRef(null);
  useReveal(ref);
  return (
    <div className="newsletter reveal" ref={ref}>
      <div className="newsletter-content">
        <h2>Join the Natural Beauty Club</h2>
        <p>Get 10% off your first order plus exclusive tips, offers &amp; early access to new launches.</p>
        <div className="nl-form">
          <input type="email" placeholder="Enter your email address" value={email} onChange={e => setEmail(e.target.value)} />
          <button onClick={() => { if (email) { alert("Thanks for subscribing! 🌿"); setEmail(""); } }}>Subscribe</button>
        </div>
      </div>
    </div>
  );
}

function Footer({ upiId }) {
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
          {upiId && <div className="pay-icon" style={{ background: "rgba(56,142,60,.3)", color: "#A5D6A7" }}>UPI: {upiId}</div>}
        </div>
      </div>
    </footer>
  );
}

function CartSidebar({ cart, open, onClose, onChangeQty, onRemove, upiId }) {
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
          {upiId && (
            <button className="gpay-btn" style={{ background: "var(--bark)", color: "var(--cream)", border: "none" }}>
              Pay via UPI: {upiId}
            </button>
          )}
          <button className="gpay-btn">Pay with Google Pay</button>
        </div>
      </div>
    </>
  );
}

function ProductModal({ product, open, onClose, onAddToCart }) {
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

function Toast({ message, show }) {
  return (
    <div className={`toast${show ? " show" : ""}`}>
      <div className="toast-check">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
      </div>
      <span>{message}</span>
    </div>
  );
}

/* Login replaced by LoginScreen component (./components/LoginScreen.jsx) */

/* ═══════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════ */
export default function DSANaturals() {
  // Flow: "splash" → "login" → "home" | "admin-login" | "admin"
  const [currentView, setCurrentView] = useState("splash");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalProduct, setModalProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "" });

  // Admin state
  const [adminProducts, setAdminProducts] = useState(() => loadFromStorage(STORAGE_KEYS.PRODUCTS, null));
  const [adminTestimonials, setAdminTestimonials] = useState(() => loadFromStorage(STORAGE_KEYS.TESTIMONIALS, null));
  const [upiId, setUpiId] = useState(() => loadFromStorage(STORAGE_KEYS.UPI, ""));
  const [orders, setOrders] = useState(() => loadFromStorage(STORAGE_KEYS.ORDERS, []));
  const [changeLog, setChangeLog] = useState(() => loadFromStorage(STORAGE_KEYS.CHANGE_LOG, []));

  // Use admin products if set, otherwise use defaults
  const activeProducts = adminProducts || PRODUCTS;
  const activeTestimonials = adminTestimonials || TESTIMONIALS;

  // Inject global styles + font
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const showToast = useCallback((msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  }, []);

  const addToCart = useCallback((id, size, qty = 1) => {
    const product = activeProducts.find(p => p.id === id);
    if (!product) return;
    setCart(prev => {
      const existing = prev.find(i => i.id === id && i.size === size);
      if (existing) return prev.map(i => i.id === id && i.size === size ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty, size: size || product.sizes[0] }];
    });
    showToast(`${product.name} added to cart!`);
  }, [showToast, activeProducts]);

  const changeCartQty = useCallback((id, size, delta) => {
    setCart(prev => {
      const updated = prev.map(i => i.id === id && i.size === size ? { ...i, qty: i.qty + delta } : i);
      return updated.filter(i => i.qty > 0);
    });
  }, []);

  const removeFromCart = useCallback((id, size) => {
    setCart(prev => prev.filter(i => !(i.id === id && i.size === size)));
  }, []);

  const toggleWishlist = useCallback((id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const openModal = useCallback((product) => {
    setModalProduct(product);
    setModalOpen(true);
  }, []);

  const handleLogin = useCallback((identifier) => {
    showToast(`Welcome, ${identifier}!`);
    setCurrentView("home");
  }, [showToast]);

  const handleSplashComplete = useCallback(() => {
    setCurrentView("login");
  }, []);

  // ── Admin Handlers ──
  const handleAdminLogin = useCallback((phone) => {
    setCurrentView("admin");
    showToast(`Admin logged in: ${phone}`);
  }, [showToast]);

  const handleAdminLogout = useCallback(() => {
    setCurrentView("login");
  }, []);

  const handleAddProduct = useCallback((product) => {
    setAdminProducts(prev => {
      const base = prev || PRODUCTS;
      const updated = [...base, product];
      saveToStorage(STORAGE_KEYS.PRODUCTS, updated);
      return updated;
    });
    setChangeLog(prev => addChangeLogEntry(prev, {
      type: "product",
      action: "Product Added",
      detail: `Added "${product.name}" (${product.category}) - ₹${product.price}`,
    }));
    showToast("Product added!");
  }, [showToast]);

  const handleDeleteProduct = useCallback((id) => {
    setAdminProducts(prev => {
      const base = prev || PRODUCTS;
      const product = base.find(p => p.id === id);
      const updated = base.filter(p => p.id !== id);
      saveToStorage(STORAGE_KEYS.PRODUCTS, updated);
      if (product) {
        setChangeLog(prev => addChangeLogEntry(prev, {
          type: "product",
          action: "Product Deleted",
          detail: `Deleted "${product.name}" (ID: ${id})`,
        }));
      }
      return updated;
    });
    showToast("Product deleted!");
  }, [showToast]);

  const handleEditProduct = useCallback((updatedProduct) => {
    setAdminProducts(prev => {
      const base = prev || PRODUCTS;
      const updated = base.map(p => p.id === updatedProduct.id ? updatedProduct : p);
      saveToStorage(STORAGE_KEYS.PRODUCTS, updated);
      return updated;
    });
    setChangeLog(prev => addChangeLogEntry(prev, {
      type: "product",
      action: "Product Updated",
      detail: `Updated "${updatedProduct.name}" - ₹${updatedProduct.price}`,
    }));
    showToast("Product updated!");
  }, [showToast]);

  const handleAddTestimonial = useCallback((testimonial) => {
    setAdminTestimonials(prev => {
      const base = prev || TESTIMONIALS;
      const updated = [...base, testimonial];
      saveToStorage(STORAGE_KEYS.TESTIMONIALS, updated);
      return updated;
    });
    setChangeLog(prev => addChangeLogEntry(prev, {
      type: "review",
      action: "Review Added",
      detail: `Added review by "${testimonial.name}" from ${testimonial.role}`,
    }));
    showToast("Review added!");
  }, [showToast]);

  const handleDeleteTestimonial = useCallback((idOrIndex) => {
    setAdminTestimonials(prev => {
      const base = prev || TESTIMONIALS;
      const updated = base.filter((t, i) => (t.id || i) !== idOrIndex);
      saveToStorage(STORAGE_KEYS.TESTIMONIALS, updated);
      return updated;
    });
    setChangeLog(prev => addChangeLogEntry(prev, {
      type: "review",
      action: "Review Deleted",
      detail: `Deleted a customer review`,
    }));
    showToast("Review deleted!");
  }, [showToast]);

  const handleUpdateUpi = useCallback((newUpi) => {
    setUpiId(newUpi);
    saveToStorage(STORAGE_KEYS.UPI, newUpi);
    setChangeLog(prev => addChangeLogEntry(prev, {
      type: "upi",
      action: "UPI Updated",
      detail: `UPI ID changed to "${newUpi}"`,
    }));
    showToast("UPI ID updated!");
  }, [showToast]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div style={{ minHeight: "100vh" }}>

      {/* ── Splash Screen ── */}
      {currentView === "splash" && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}

      {/* ── Auth / Login Screen ── */}
      {currentView === "login" && (
        <LoginScreen onLogin={handleLogin} onAdminMode={() => setCurrentView("admin-login")} />
      )}

      {/* ── Admin Login ── */}
      {currentView === "admin-login" && (
        <AdminLogin onAdminLogin={handleAdminLogin} onBack={() => setCurrentView("login")} />
      )}

      {/* ── Admin Dashboard ── */}
      {currentView === "admin" && (
        <AdminPanel
          products={activeProducts}
          testimonials={activeTestimonials}
          upiId={upiId}
          orders={orders}
          changeLog={changeLog}
          onAddProduct={handleAddProduct}
          onDeleteProduct={handleDeleteProduct}
          onEditProduct={handleEditProduct}
          onAddTestimonial={handleAddTestimonial}
          onDeleteTestimonial={handleDeleteTestimonial}
          onUpdateUpi={handleUpdateUpi}
          onLogout={handleAdminLogout}
          onBack={() => setCurrentView("home")}
        />
      )}

      {/* ── Main Application ── */}
      {currentView === "home" && (
        <>
          <Navbar
            cartCount={cartCount}
            onCartOpen={() => setCartOpen(true)}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            onLoginClick={() => setCurrentView("login")}
            onFilterCategory={cat => { setFilter(cat); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}
          />
          <Hero
            onShop={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
            onFilterCategory={cat => { setFilter(cat); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}
          />
          <Marquee />
          <Features />
          <Categories onFilterCategory={cat => { setFilter(cat); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }} />
          <Products
            products={activeProducts}
            filter={filter}
            onFilterChange={setFilter}
            searchQuery={searchQuery}
            onAddToCart={addToCart}
            onOpenModal={openModal}
            wishlist={wishlist}
            onToggleWish={toggleWishlist}
          />
          <OfferBanner />
          <Ingredients />
          <Testimonials testimonials={activeTestimonials} />
          <Newsletter />
          <Footer upiId={upiId} />
          <CartSidebar cart={cart} open={cartOpen} onClose={() => setCartOpen(false)} onChangeQty={changeCartQty} onRemove={removeFromCart} upiId={upiId} />
          <ProductModal product={modalProduct} open={modalOpen} onClose={() => setModalOpen(false)} onAddToCart={addToCart} />
        </>
      )}

      <Toast message={toast.message} show={toast.show} />
    </div>
  );
}