/**
 * Fan art própria (não é arte oficial). Desenhado de perfil, virado para a direita, num viewBox
 * 120×100 com os pés em y=100. Os grupos com classe são animados pelo engine e pelo CSS.
 */
export function OshawottSprite() {
  return (
    <svg viewBox="0 0 120 100" className="osha-svg">
      <g className="tail" style={{ transformOrigin: "40px 82px" }}>
        <path d="M42 76 Q22 70 9 82 Q11 90 24 89 Q36 88 44 84 Z" fill="#2C4C72" />
      </g>
      <g className="leg-b" style={{ transformOrigin: "50px 86px" }}>
        <rect x="44" y="84" width="12" height="16" rx="5" fill="#223c5c" />
      </g>
      <ellipse cx="56" cy="78" rx="21" ry="16" fill="#9FD3EC" />
      <ellipse cx="73" cy="72" rx="6" ry="4.5" fill="#8cc6e2" />
      <g className="scalchop" style={{ transformOrigin: "70px 82px" }}>
        <path d="M63 77 Q70 67 77 77 Q77 87 70 89 Q63 87 63 77 Z" fill="#E7C76E" />
        <path d="M70 72 V88 M66.5 75 L68 87 M73.5 75 L72 87" stroke="#B98F35" strokeWidth="1.2" fill="none" />
      </g>
      <g className="leg-a" style={{ transformOrigin: "66px 86px" }}>
        <rect x="60" y="84" width="12" height="16" rx="5" fill="#2C4C72" />
      </g>
      <circle cx="51" cy="21" r="8" fill="#F4F8FB" />
      <circle cx="51" cy="21" r="4" fill="#9FD3EC" />
      <circle cx="66" cy="42" r="26" fill="#F4F8FB" />
      <circle cx="80" cy="51" r="1.4" fill="#7FBFE0" />
      <circle cx="84" cy="53.5" r="1.4" fill="#7FBFE0" />
      <circle cx="79" cy="55" r="1.4" fill="#7FBFE0" />
      <ellipse cx="78" cy="36" rx="3.4" ry="4.2" fill="#1d2433" />
      <circle cx="79.2" cy="34.4" r="1.2" fill="#fff" />
      <ellipse cx="90" cy="44" rx="4" ry="3" fill="#2C4C72" />
      <path className="mouth-closed" d="M84 51 q2 2.2 4 0" stroke="#3A2A2A" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <g className="mouth-open" style={{ transformOrigin: "87px 53px" }}>
        <ellipse cx="87" cy="54" rx="4" ry="4.5" fill="#6b1f2a" />
        <ellipse cx="87" cy="56.5" rx="2.6" ry="1.8" fill="#e0607a" />
      </g>
    </svg>
  );
}
