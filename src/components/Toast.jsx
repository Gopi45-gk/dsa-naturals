export default function Toast({ message, show }) {
  return (
    <div className={`toast${show ? " show" : ""}`}>
      <div className="toast-check">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
      </div>
      <span>{message}</span>
    </div>
  );
}
