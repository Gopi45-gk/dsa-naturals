export default function Features() {
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
