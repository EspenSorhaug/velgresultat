import express from "express";
import cors from "cors";
import type {
  NrkResponse,
  Parti,
  ResultatPayload,
  Side,
} from "./types.js";

const NRK_API = "https://valg.nrk.no/api/2025/st";
const POLL_INTERVAL_MS = 30_000;
const MAJORITY_THRESHOLD = 85;
const PORT = process.env.PORT ?? 3001;

let latest: ResultatPayload | null = null;
let lastError: string | null = null;

/** Build a parti.id -> Side map from the Rød/Blå konstellasjoner. */
function buildSideMap(data: NrkResponse): Map<string, Side> {
  const map = new Map<string, Side>();
  for (const k of data.konstellasjoner ?? []) {
    const navn = k.navn?.toLowerCase() ?? "";
    let side: Side | null = null;
    if (navn.includes("rød") || navn.includes("raud")) side = "venstre";
    else if (navn.includes("blå")) side = "hoyre";
    if (!side) continue;
    for (const id of k.partierIder ?? []) map.set(id, side);
  }
  return map;
}

function transform(data: NrkResponse): ResultatPayload {
  const sideMap = buildSideMap(data);

  // Alle kategori 0-partier ("Andre") slås sammen til én blokk.
  const andre = data.partier.filter((p) => p.parti.kategori === 0);
  const ovrige = data.partier.filter((p) => p.parti.kategori !== 0);

  const parties: Parti[] = ovrige.map((p) => ({
    id: p.parti.id,
    kortNavn: p.parti.kortNavn,
    farge: p.parti.farge,
    mandater: p.mandater?.antall ?? 0,
    defaultSide: sideMap.get(p.parti.id) ?? "noytral",
  }));

  if (andre.length > 0) {
    parties.push({
      id: "ANDRE",
      kortNavn: "An",
      farge: "#000000",
      mandater: andre.reduce((acc, p) => acc + (p.mandater?.antall ?? 0), 0),
      defaultSide: "noytral",
    });
  }

  return {
    totalMandater: data.mandater?.antall ?? 169,
    majorityThreshold: MAJORITY_THRESHOLD,
    parties,
    updatedAt: new Date().toISOString(),
  };
}

async function poll(): Promise<void> {
  try {
    const res = await fetch(NRK_API);
    if (!res.ok) throw new Error(`NRK API svarte ${res.status}`);
    const data = (await res.json()) as NrkResponse;
    latest = transform(data);
    lastError = null;
    console.log(
      `[poll] oppdatert ${latest.updatedAt} – ${latest.parties.length} partier`,
    );
  } catch (err) {
    lastError = err instanceof Error ? err.message : String(err);
    console.error("[poll] feil:", lastError);
  }
}

const app = express();
app.use(cors());

app.get("/api/resultat", (_req, res) => {
  if (!latest) {
    res.status(503).json({ error: lastError ?? "Data ikke klart ennå" });
    return;
  }
  res.json(latest);
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: latest !== null, lastError, updatedAt: latest?.updatedAt });
});

app.listen(PORT, () => {
  console.log(`Backend kjører på http://localhost:${PORT}`);
  void poll();
  setInterval(() => void poll(), POLL_INTERVAL_MS);
});
