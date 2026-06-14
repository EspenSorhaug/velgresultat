import { useState } from "react";
import type { Parti, Side } from "./types.js";
import { PartiBlokk } from "./PartiBlokk.js";

interface Props {
  side: Side;
  label: string;
  partier: Parti[];
  threshold: number;
  onDropParti: (id: string, side: Side) => void;
}

export function Seksjon({ side, label, partier, threshold, onDropParti }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const sum = partier.reduce((acc, p) => acc + p.mandater, 0);
  const hasMajority = sum >= threshold;

  return (
    <section
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
        <h2>{label}</h2>
        <div
          className={`mandater-sum${hasMajority ? " majority" : ""}`}
          title={hasMajority ? "Flertall!" : undefined}
        >
          {sum} mandater
        </div>
      </header>
      <div className="blokker">
        {partier.map((p) => (
          <PartiBlokk key={p.id} parti={p} />
        ))}
      </div>
    </section>
  );
}
