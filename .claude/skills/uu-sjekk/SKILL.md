---
name: uu-sjekk
description: Kjør en strukturert universell-utforming-gjennomgang (WCAG 2.2 AA / EN 301 549) av React-komponenter eller en side. Bruk når brukeren ber om en UU-sjekk, tilgjengelighetsrevisjon, a11y-review, eller vil vite om noe oppfyller tilgjengelighetskrav.
---

# UU-sjekk

En fast, repeterbar tilgjengelighetsgjennomgang for dette React 18 + TypeScript-prosjektet.

## Omfang
- Hvis brukeren oppgir fil(er) eller komponent: gjennomgå disse.
- Hvis ingenting er oppgitt: spør hva som skal sjekkes, eller bruk filen som er åpen i IDE-en.

## Steg (gå gjennom i rekkefølge)

1. **Semantikk** — Brukes riktige HTML-elementer (`button`, `nav`, `main`, `ul`, `h1–h6`, `label`)? Er overskriftsnivåene logiske og uten hopp? Er `div`/`span` med `onClick` egentlig en `button`?
2. **Tastatur** — Kan alt interaktivt nås og betjenes med Tab/Enter/Space/piltaster? Logisk tab-rekkefølge? Synlig fokusindikator? Ingen tastaturfeller eller positive `tabIndex`?
3. **Navn, rolle, verdi** — Har hvert interaktivt element et tilgjengelig navn (tekst, `aria-label`, koblet `<label>`)? Riktig rolle? Annonseres dynamiske statusendringer (`aria-live` der det trengs)?
4. **Skjema** — Hver input koblet til `<label>`? Feilmeldinger i tekst og koblet med `aria-describedby`? Tydelig markering av påkrevde felt (ikke kun farge)?
5. **Farge og kontrast** — Tekstkontrast ≥ 4.5:1 (3:1 for stor tekst / UI-komponenter)? Formidles informasjon aldri kun via farge? (Viktig for parti-/valgdata.)
6. **Bilder og media** — Meningsbærende bilder har `alt`; dekorative har `alt=""`. Ikoner som er knapper har tilgjengelig navn.
7. **Respons og preferanser** — Tåler layouten 200 % zoom og 320px bredde? Respekteres `prefers-reduced-motion` og `prefers-color-scheme`?
8. **Språk** — Riktig `lang`-attributt og norsk tekst i UI?

## Automatiske sjekker (hvis verktøy finnes)
- Kjør `eslint` hvis `eslint-plugin-jsx-a11y` er konfigurert.
- Foreslå `axe` / `@axe-core/react` hvis det ikke allerede finnes, men ikke installer uten å spørre.

## Rapportformat
Oppsummer funnene rangert etter alvorlighetsgrad. For hvert funn:

```
[Blokkerende | Alvorlig | Mindre] fil:linje
Problem: <kort beskrivelse> (WCAG <kriterium>)
Fiks: <konkret forslag, gjerne kodeeksempel>
```

Avslutt med:
- Kort totalvurdering (er det klart for produksjon mht. UU?).
- Forslag til manuell test: tastaturgjennomgang + skjermleser (VoiceOver/NVDA).

## Når funn skal rettes
Hvis brukeren ber om det, bruk `uu-frontend`-agenten til å gjennomføre selve rettingene. Selve sjekken endrer ikke kode uten at brukeren ber om det.
