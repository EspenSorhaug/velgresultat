# Valgresultat – Regjeringsbygger

Webklient som viser valgresultatet per parti og lar deg kombinere partier på
**Venstresiden**, **Nøytral** og **Høyresiden** for å se hvem som har nok
mandater (≥ 85 av 169) til å danne regjering.

Se [spec.md](spec.md) for full kravspesifikasjon.

## Stack

- **client/** – React + TypeScript (Vite)
- **server/** – Node.js + Express (TypeScript), poller NRKs valg-API hvert 30. sekund
- **pnpm** workspaces

## Starte applikasjonen

```bash
pnpm install
pnpm dev
```

`pnpm dev` starter både backend (port 3001) og frontend (port 5173) samtidig.
Åpne <http://localhost:5173>.

Frontend proxyer `/api/*` til backend via Vite. Backend henter live data fra
<https://valg.nrk.no/api/2025/st>.

## Bruk

- Hvert parti vises som en farget blokk med kortnavn og mandater.
- Dra og slipp blokker mellom de tre seksjonene.
- Mandatsummen over hver seksjon vises i **fet** skrift når den når flertall (≥ 85).
- Mandattall oppdateres automatisk hvert 30. sekund; din plassering bevares.

## Produksjonsbygg

```bash
pnpm build          # bygger server (dist/) og client (dist/)
pnpm --filter server start
pnpm --filter client preview
```
