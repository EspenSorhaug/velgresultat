import { useCallback, useEffect, useRef, useState } from "react";
import type { Parti, ResultatPayload, Side } from "./types.js";
import { SIDER } from "./types.js";
import { Seksjon } from "./Seksjon.js";

const POLL_INTERVAL_MS = 30_000;

export default function App() {
  const [data, setData] = useState<ResultatPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  /** id -> side, brukerens plassering. Bevares på tvers av oppdateringer. */
  const [placement, setPlacement] = useState<Record<string, Side>>({});
  const placementRef = useRef(placement);
  placementRef.current = placement;

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/resultat");
      if (!res.ok) throw new Error(`Server svarte ${res.status}`);
      const payload = (await res.json()) as ResultatPayload;
      setData(payload);
      setError(null);
      // Fyll inn plassering for partier vi ikke har sett før, behold resten.
      setPlacement((prev) => {
        const next = { ...prev };
        for (const p of payload.parties) {
          if (!(p.id in next)) next[p.id] = p.defaultSide;
        }
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  useEffect(() => {
    void load();
    const t = setInterval(() => void load(), POLL_INTERVAL_MS);
    return () => clearInterval(t);
  }, [load]);

  const move = useCallback((id: string, side: Side) => {
    setPlacement((prev) => ({ ...prev, [id]: side }));
  }, []);

  const partiesBySide = (side: Side): Parti[] =>
    (data?.parties ?? []).filter((p) => (placement[p.id] ?? p.defaultSide) === side);

  const threshold = data?.majorityThreshold ?? 85;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Valgresultat – Regjeringsbygger</h1>
        <p className="sub">
          {data
            ? `${data.totalMandater} mandater totalt · ${threshold} kreves for flertall`
            : "Laster …"}
          {data && (
            <span className="updated">
              {" "}
              · oppdatert {new Date(data.updatedAt).toLocaleTimeString("no-NO")}
            </span>
          )}
        </p>
        {error && <p className="error">Kunne ikke hente data: {error}</p>}
      </header>

      <main className="sections">
        {SIDER.map(({ key, label }) => (
          <Seksjon
            key={key}
            side={key}
            label={label}
            partier={partiesBySide(key)}
            threshold={threshold}
            onDropParti={move}
          />
        ))}
      </main>
    </div>
  );
}
