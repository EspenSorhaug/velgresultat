# Spec: Valgresultat – Regjeringsbygger

## 1. Formål

En webklient som viser valgresultatet per parti og lar brukeren kombinere
partier på **Venstresiden**, **Nøytral** og **Høyresiden** for å se hvilke
konstellasjoner som har nok mandater til å danne regjering.

Stortinget har **169 mandater** totalt. En side trenger **85 mandater**
(flertall) for å kunne danne regjering.

## 2. Tech stack

| Lag       | Teknologi                                  |
|-----------|--------------------------------------------|
| Frontend  | React + TypeScript                         |
| Pakkebehandler | pnpm                                  |
| Backend   | Node.js                                     |

Appen skal være kjørbar lokalt (f.eks. `pnpm install` + `pnpm dev`).

## 3. Datakilde

Stemmedata hentes fra NRKs valg-API:

```
https://valg.nrk.no/api/2025/st
```

- Backend (Node.js) henter data fra API-et og eksponerer det til frontend.
- Data skal hentes på nytt **hvert 30. sekund** for live oppdatering.
- `SampleData.json` viser strukturen til ett parti-objekt og brukes som
  referanse / fallback under utvikling.

### Relevante felter per parti

| Felt              | Beskrivelse                                  | Eksempel   |
|-------------------|----------------------------------------------|------------|
| `parti.kortNavn`  | Kortnavn vist i blokken                       | `"R"`      |
| `parti.farge`     | Partiets farge (bakgrunn på blokken)          | `"#7B0A02"`|
| `parti.kategori`  | Skiller etablerte (1) fra småpartier (2/3)     | `1`        |
| `mandater.antall` | Antall mandater partiet har fått              | `9`        |

**Initiell plassering:** API-et har et felt `konstellasjoner` med blokkene
«Rød» og «Blå» og hvilke parti-IDer de inneholder. Disse brukes til å plassere
partiene ved oppstart: Rød → Venstresiden, Blå → Høyresiden, resten → Nøytral.
(`kategori` egner seg ikke, da alle partier med mandater har `kategori = 1`.)

> Merk: i `SampleData.json` ligger mandattallet under `mandater.antall`, ikke
> et toppnivåfelt `mandater`. Backend mapper dette til en flat partistruktur
> som frontend bruker.

## 4. Datamodell (frontend)

```ts
type Side = "venstre" | "noytral" | "hoyre";

interface Parti {
  id: string;          // parti.id
  kortNavn: string;    // parti.kortNavn
  farge: string;       // parti.farge
  mandater: number;    // mandater.antall
  kategori: number;    // parti.kategori (initiell plassering)
  side: Side;          // gjeldende seksjon (kan endres av bruker)
}
```

Ved første lasting plasseres partier basert på `konstellasjoner`. Brukerens egne
flyttinger skal bevares ved live-oppdatering (oppdater mandattall uten å
nullstille plassering).

## 5. Funksjonalitet

### 5.1 Partiblokk
Hvert parti vises som en blokk med:
- `kortNavn` som tekst
- `farge` som bakgrunnsfarge
- antall `mandater`

### 5.2 Tre seksjoner
Tre seksjoner plassert horisontalt ved siden av hverandre:

1. **Venstresiden**
2. **Nøytral**
3. **Høyresiden**

Blokker kan ligge i hvilken som helst av de tre seksjonene.

### 5.3 Mandattelling per seksjon
- Over blokkene i hver seksjon vises summen av mandater for partiene i
  seksjonen, tydelig fremhevet.
- Når en seksjon har **≥ 85 mandater**, vises tallet/teksten i **bold** for å
  signalisere flertall.

### 5.4 Flytte partier
- Brukeren kan flytte partier mellom Venstresiden, Nøytral og Høyresiden
  (f.eks. drag-and-drop eller knapper).
- Mandatsummen i berørte seksjoner oppdateres umiddelbart etter flytting.

### 5.5 Live oppdatering
- Mandattall oppdateres automatisk hvert 30. sekund fra API-et.
- Brukerens plassering av partier i seksjoner skal ikke gå tapt ved oppdatering.

## 6. Akseptkriterier

- [ ] Appen starter lokalt med pnpm og kjører React + TS frontend mot
      Node.js-backend.
- [ ] Backend henter data fra NRK-API-et hvert 30. sekund.
- [ ] Alle partier vises som blokker med kortNavn, riktig farge og mandater.
- [ ] Tre seksjoner (Venstresiden, Nøytral, Høyresiden) vises horisontalt.
- [ ] Sum av mandater vises over blokkene i hver seksjon.
- [ ] Seksjon med ≥ 85 mandater vises i bold.
- [ ] Partier kan flyttes mellom seksjoner, og summene oppdateres.
- [ ] Mandattall oppdateres live uten å miste brukerens plassering.
