import { useState } from "react";
import type { Parti, Side } from "./types.js";
import { PartiBlokk } from "./PartiBlokk.js";

interface Props {
  side: Side;
  label: string;
  partier: Parti[];
  threshold: number;
  onDropParti: (id: string, side: Side) => void;
  /** Parti som skal ta fokus etter en tastaturflytt. */
  focusId: string | null;
  onFocusHandled: () => void;
}

export function Seksjon({
  side,
  label,
  partier,
  threshold,
  onDropParti,
  focusId,
  onFocusHandled,
}: Props) {
  const [dragOver, setDragOver] = useState(false);
  const sum = partier.reduce((acc, p) => acc + p.mandater, 0);
  const hasMajority = sum >= threshold;

  // Unik id per seksjon for aria-labelledby (funn 7)
  const headingId = `seksjon-heading-${side}`;

  return (
    <section
      aria-labelledby={headingId}
      className={`seksjon${dragOver ? " drag-over" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const id = e.dataTransfer.getData("text/plain");
        if (id) onDropParti(id, side);
      }}
    >
      <header className="seksjon-header">
        <h2 id={headingId}>{label}</h2>
        {/* Funn 5: flertall formidles som synlig tekst, ikke bare farge */}
        <div className={`mandater-sum${hasMajority ? " majority" : ""}`}>
          {sum} mandater
          {hasMajority && (
            <span className="flertall-badge" aria-label="Flertall oppnadd">
              {" "}&#10003; Flertall
            </span>
          )}
        </div>
      </header>
      <div className="blokker">
        {partier.map((p) => (
          <PartiBlokk
            key={p.id}
            parti={p}
            currentSide={side}
            onMove={onDropParti}
            shouldFocus={p.id === focusId}
            onFocused={onFocusHandled}
          />
        ))}
      </div>
    </section>
  );
}
