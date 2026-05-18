/* ─── DATA CONSTANTS ─── */

export const PRODUCTS = [
  { id: 1, name: "Argan Oil Hair Serum", brand: "DSA Hair", category: "Hair Care", price: 449, orig: 699, rating: 4.9, reviews: 328, badge: "Best Seller", badgeClass: "hot", img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80", imgs: ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80", "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80"], desc: "Lightweight, non-greasy serum packed with pure Moroccan Argan Oil. Controls frizz, adds brilliant shine, and nourishes each strand deeply.", sizes: ["50ml", "100ml", "200ml"] },
  { id: 2, name: "Rose Hip Face Serum", brand: "DSA Skin", category: "Skin Care", price: 599, orig: 899, rating: 4.8, reviews: 214, badge: "New", badgeClass: "new", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80", imgs: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80"], desc: "A potent Vitamin C & Rosehip oil blend that brightens dull skin, fades dark spots, and delivers a youthful, radiant glow.", sizes: ["30ml", "50ml"] },
  { id: 3, name: "Coconut Deep Repair Mask", brand: "DSA Hair", category: "Hair Care", price: 349, orig: 499, rating: 4.7, reviews: 186, badge: "Sale", badgeClass: "sale", img: "https://images.unsplash.com/photo-1600857062241-98e5dba7f114?w=400&q=80", imgs: ["https://images.unsplash.com/photo-1600857062241-98e5dba7f114?w=600&q=80"], desc: "Intensive conditioning hair mask with virgin coconut oil and shea butter. Revives damaged, brittle hair in just one use.", sizes: ["150g", "300g"] },
  { id: 4, name: "Aloe Vera Gel Moisturiser", brand: "DSA Skin", category: "Skin Care", price: 299, orig: 449, rating: 4.6, reviews: 412, badge: "", badgeClass: "", img: "https://images.unsplash.com/photo-1611125532756-d073acfb5e6b?w=400&q=80", imgs: ["https://images.unsplash.com/photo-1611125532756-d073acfb5e6b?w=600&q=80"], desc: "Pure aloe vera gel blended with cucumber extract. Ultra-light, absorbs instantly, soothes redness and provides all-day hydration.", sizes: ["100g", "250g"] },
  { id: 5, name: "Castor Hair Growth Oil", brand: "DSA Hair", category: "Oils", price: 399, orig: 599, rating: 4.8, reviews: 298, badge: "Best Seller", badgeClass: "hot", img: "https://images.unsplash.com/photo-1574080580498-5b9e5c5b7989?w=400&q=80", imgs: ["https://images.unsplash.com/photo-1574080580498-5b9e5c5b7989?w=600&q=80"], desc: "Cold-pressed black castor oil enriched with biotin and rosemary essential oil. Stimulates hair follicles for thicker, fuller growth.", sizes: ["100ml", "200ml"] },
  { id: 6, name: "Turmeric Glow Face Pack", brand: "DSA Skin", category: "Masks", price: 249, orig: 399, rating: 4.7, reviews: 167, badge: "New", badgeClass: "new", img: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&q=80", imgs: ["https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80"], desc: "Ancient Ayurvedic turmeric and sandalwood face pack. Brightens complexion, controls oiliness, and gives an instant golden glow.", sizes: ["75g", "150g"] },
  { id: 7, name: "Jojoba Scalp Treatment", brand: "DSA Hair", category: "Oils", price: 499, orig: 750, rating: 4.9, reviews: 94, badge: "", badgeClass: "", img: "https://images.unsplash.com/photo-1552693673-1bf958298935?w=400&q=80", imgs: ["https://images.unsplash.com/photo-1552693673-1bf958298935?w=600&q=80"], desc: "Lightweight jojoba oil with tea tree and peppermint. Balances scalp sebum, soothes dandruff, and promotes a healthy scalp environment.", sizes: ["50ml", "100ml"] },
  { id: 8, name: "Multani Mitti Clay Mask", brand: "DSA Skin", category: "Masks", price: 189, orig: 299, rating: 4.5, reviews: 223, badge: "", badgeClass: "", img: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=400&q=80", imgs: ["https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&q=80"], desc: "Traditional Fuller's earth with rosewater and neem. Deep cleanses pores, removes impurities and controls excess oil naturally.", sizes: ["100g", "200g"] },
];

export const CATEGORIES = [
  { name: "Hair Care", count: 24, pill: "Bestseller", img: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&q=80", span: 2 },
  { name: "Skin Care", count: 18, pill: "", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80", span: 1 },
  { name: "Oils", count: 12, pill: "", img: "https://images.unsplash.com/photo-1600857062241-98e5dba7f114?w=600&q=80", span: 1 },
  { name: "Masks", count: 10, pill: "New", img: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80", span: 1 },
];

export const INGREDIENTS = [
  { icon: "🌿", name: "Aloe Vera", desc: "Deeply hydrates & soothes irritated skin" },
  { icon: "🥥", name: "Coconut Oil", desc: "Nourishes hair from root to tip" },
  { icon: "🌹", name: "Rose Hip", desc: "Rich in Vitamin C for radiant skin" },
  { icon: "🍯", name: "Raw Honey", desc: "Natural humectant & antibacterial" },
  { icon: "🫚", name: "Argan Oil", desc: "Liquid gold for silky smooth hair" },
];

export const TESTIMONIALS = [
  { text: "The Argan Oil Hair Serum completely transformed my frizzy hair. After just two weeks, my hair is smoother, shinier, and healthier than ever before!", name: "Priya Sharma", role: "Chennai", color: "#A5D6A7", textColor: "#1B5E20" },
  { text: "I've tried so many skincare brands but DSA Naturals is truly different. The Rose Hip Face Serum cleared my acne scars in just a month. Absolutely love it!", name: "Anika Reddy", role: "Bangalore", color: "#8FAE91", textColor: "#fff" },
  { text: "My skin feels like velvet after using the Aloe & Honey moisturiser. Natural, effective, and smells divine. Will never go back to chemical products!", name: "Rahul Menon", role: "Mumbai", color: "#66BB6A", textColor: "#1B5E20" },
];

export const MARQUEE_ITEMS = ["Free Shipping on ₹599+", "100% Natural Ingredients", "No Parabens", "Dermatologist Tested", "Cruelty Free", "Vegan Certified", "Made in India"];
