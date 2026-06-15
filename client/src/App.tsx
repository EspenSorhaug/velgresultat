import { useCallback, useEffect, useRef, useState } from "react";
import type { Parti, ResultatViewModel, Side } from "./types.js";
import { SIDER } from "./types.js";
import { Seksjon } from "./Seksjon.js";

const POLL_INTERVAL_MS = 30_000;

export default function App() {
  const [data, setData] = useState<ResultatViewModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  /** id -> side, brukerens plassering. Bevares på tvers av oppdateringer. */
  const [placement, setPlacement] = useState<Record<string, Side>>({});
  const placementRef = useRef(placement);
  placementRef.current = placement;

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/resultat");
      if (!response.ok) throw new Error(`Server svarte ${response.status}`);
      const payload = (await response.json()) as ResultatViewModel;
      setData(payload);
      setError(null);
      // Fyll inn plassering for partier vi ikke har sett før, behold resten.
      setPlacement((prev) => {
        const next = { ...prev };
        for (const p of payload.partier) {
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
    (data?.partier ?? []).filter((p) => (placement[p.id] ?? p.defaultSide) === side);

  const terskel = data?.flertallTerskel ?? 85;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Valgresultat – Regjeringsbygger</h1>
        <p className="sub">
          {data
            ? `${data.totaltAntallMandater} mandater totalt · ${terskel} kreves for flertall`
            : "Laster …"}
          {data && (
            <span className="updated">
              {" "}
              · oppdatert {new Date(data.oppdatert).toLocaleTimeString("no-NO")}
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
            threshold={terskel}
            onDropParti={move}
          />
        ))}
      </main>
    </div>
  );
}
