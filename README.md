# Valgresultat – Regjeringsbygger

Webklient som viser antall mandater per parti og lar deg kombinere partier på
**Venstresiden**, **Nøytral** og **Høyresiden** for å se hvem som har nok
mandater (≥ 85 av 169) til å danne regjering.

Se [spec.md](spec.md) for full kravspesifikasjon.

## Stack

- **client/** – React + TypeScript (Vite)
- **server/** – Node.js + Express (TypeScript), poller NRKs valg-API hvert 30. sekund
- **pnpm** workspaces

## Requirements
- **Node.js**
- **pnpm**

## Starte applikasjonen

```bash
pnpm install
pnpm dev
```

`pnpm dev` starter både backend (port 3001) og frontend (port 5173) samtidig.
Åpne <http://localhost:5173>.
