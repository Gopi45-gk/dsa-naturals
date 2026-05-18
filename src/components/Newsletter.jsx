import { useState, useRef } from "react";
import { useReveal } from "../hooks/useAnimations";

export default function Newsletter() {
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
