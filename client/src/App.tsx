import { useCallback, useEffect, useRef, useState } from "react";
import type { Parti, ResultatViewModel, Side } from "./types.js";
import { SIDER } from "./types.js";
import { Seksjon } from "./Seksjon.js";
import { MandatBlokk } from "./MandatBlokk.js";

const POLL_INTERVAL_MS = 30_000;

export default function App() {
  const [data, setData] = useState<ResultatViewModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  /** id -> side, brukerens plassering. Bevares på tvers av oppdateringer. */
  const [placement, setPlacement] = useState<Record<string, Side>>({});
  const placementRef = useRef(placement);
  placementRef.current = placement;
  /** Parti som nettopp ble flyttet via tastatur, og som skal beholde fokus. */
  const [focusId, setFocusId] = useState<string | null>(null);

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
    setFocusId(id);
  }, []);

  const clearFocus = useCallback(() => setFocusId(null), []);

  // Sortert synkende etter mandater: partiet med flest havner øverst til venstre.
  const partiesBySide = (side: Side): Parti[] =>
    (data?.partier ?? [])
      .filter((p) => (placement[p.id] ?? p.defaultSide) === side)
      .sort((a, b) => b.mandater - a.mandater);

  const terskel = data?.flertallTerskel ?? 85;

  const sumForSide = (side: Side): number =>
    partiesBySide(side).reduce((acc, p) => acc + p.mandater, 0);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Valgresultat – Regjeringsbygger</h1>
        {/* Funn 4: aria-live="polite" annonserer statusendringer for skjermlesere */}
        <p className="sub" aria-live="polite" aria-atomic="true">
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
        {/* Funn 4: role="alert" sikrer umiddelbar annonsering av feil */}
        {error && (
          <p className="error" role="alert">
            Kunne ikke hente data: {error}
          </p>
        )}
      </header>

      <MandatBlokk
        venstre={sumForSide("venstre")}
        noytral={sumForSide("noytral")}
        hoyre={sumForSide("hoyre")}
        total={data?.totaltAntallMandater ?? 169}
      />

      <main className="sections">
        {SIDER.map(({ key, label }) => (
          <Seksjon
            key={key}
            side={key}
            label={label}
            partier={partiesBySide(key)}
            threshold={terskel}
            onDropParti={move}
            focusId={focusId}
            onFocusHandled={clearFocus}
          />
        ))}
      </main>
    </div>
  );
}
