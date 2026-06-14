import type { Parti } from "./types.js";

/** Velg svart eller hvit tekst basert på bakgrunnsfargens lyshet. */
function textColor(hex: string): string {
  const m = hex.replace("#", "");
  if (m.length !== 6) return "#fff";
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#1a1a1a" : "#ffffff";
}

export function PartiBlokk({ parti }: { parti: Parti }) {
  return (
    <div
      className="parti-blokk"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", parti.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      style={{ backgroundColor: parti.farge, color: textColor(parti.farge) }}
      title={`${parti.kortNavn}: ${parti.mandater} mandater`}
    >
      <span className="parti-navn">{parti.kortNavn}</span>
      <span className="parti-mandater">{parti.mandater}</span>
    </div>
  );
}
