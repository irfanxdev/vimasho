// A small original diamond/temple motif used sparingly as a section divider,
// keeping the same restrained gold linework language as the VIMASHO mark.
export default function Motif({ className = '' }) {
  return (
    <svg
      className={className}
      width="56"
      height="20"
      viewBox="0 0 56 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line x1="0" y1="10" x2="20" y2="10" stroke="#BF9B30" strokeWidth="1" />
      <line x1="36" y1="10" x2="56" y2="10" stroke="#BF9B30" strokeWidth="1" />
      <rect x="24" y="6" width="8" height="8" transform="rotate(45 28 10)" stroke="#BF9B30" strokeWidth="1" fill="none" />
      <rect x="26.5" y="8.5" width="3" height="3" transform="rotate(45 28 10)" fill="#BF9B30" />
    </svg>
  );
}
