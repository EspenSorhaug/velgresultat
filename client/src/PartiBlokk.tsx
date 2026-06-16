import { useEffect, useRef } from "react";
import type { Parti, Side } from "./types.js";
import { SIDER } from "./types.js";

/**
 * Beregner relativ luminans etter WCAG 2.x (sRGB-gamma).
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function relativeLuminance(hex: string): number {
  const m = hex.replace("#", "");
  if (m.length !== 6) return 0;
  const toLinear = (c: number): number => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const r = toLinear(parseInt(m.slice(0, 2), 16));
  const g = toLinear(parseInt(m.slice(2, 4), 16));
  const b = toLinear(parseInt(m.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastforhold mellom to luminansverdier (WCAG-formel). */
function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Velg svart eller hvit tekst slik at kontrastforholdet mot bakgrunnen
 * alltid er høyest mulig og oppfyller WCAG 1.4.3 (4.5:1).
 */
function textColor(hex: string): string {
  const bgLum = relativeLuminance(hex);
  const whiteLum = 1;
  const blackLum = 0;
  const whiteContrast = contrastRatio(whiteLum, bgLum);
  const blackContrast = contrastRatio(blackLum, bgLum);
  return whiteContrast >= blackContrast ? "#ffffff" : "#1a1a1a";
}

interface Props {
  parti: Parti;
  currentSide: Side;
  onMove: (id: string, side: Side) => void;
  /** Sann når blokka nettopp ble flyttet hit via tastatur og skal ta fokus. */
  shouldFocus: boolean;
  onFocused: () => void;
}

export function PartiBlokk({ parti, currentSide, onMove, shouldFocus, onFocused }: Props) {
  // Kun nabofeltene: blokker kan flyttes én seksjon om gangen.
  const currentIndex = SIDER.findIndex((s) => s.key === currentSide);
  const naboer = [SIDER[currentIndex - 1], SIDER[currentIndex + 1]].filter(
    (s): s is (typeof SIDER)[number] => Boolean(s),
  );
  const knapperRef = useRef<HTMLSpanElement>(null);

  // Behold fokus etter en tastaturflytt: blokka re-mountes i en ny seksjon,
  // så vi setter fokus på dens første flytteknapp her.
  useEffect(() => {
    if (!shouldFocus) return;
    knapperRef.current?.querySelector("button")?.focus();
    onFocused();
  }, [shouldFocus, onFocused]);

  return (
    <div
      className="parti-blokk"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", parti.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      style={{ backgroundColor: parti.farge, color: textColor(parti.farge) }}
    >
      {/* Synlig tekst gir tilgjengelig navn — title-tooltip er fjernet (funn 2) */}
      <span className="parti-info">
        <span className="parti-navn">{parti.kortNavn}</span>
        <span className="parti-mandater" aria-label={`${parti.mandater} mandater`}>
          {parti.mandater}
        </span>
      </span>

      {/* Tastaturalternativ til drag-and-drop (funn 1) */}
      <span
        ref={knapperRef}
        className="parti-knapper"
        role="group"
        aria-label={`Flytt ${parti.kortNavn}`}
      >
        {naboer.map((s) => {
          const retning = SIDER.findIndex((x) => x.key === s.key) < currentIndex ? "←" : "→";
          return (
            <button
              key={s.key}
              className="flytt-knapp"
              onClick={() => onMove(parti.id, s.key)}
              aria-label={`Flytt ${parti.kortNavn} til ${s.label}`}
              title={`Flytt til ${s.label}`}
              style={{ color: textColor(parti.farge) }}
            >
              {retning}
            </button>
          );
        })}
      </span>
    </div>
  );
}
