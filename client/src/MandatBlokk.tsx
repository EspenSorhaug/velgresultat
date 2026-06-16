interface Props {
  venstre: number;
  noytral: number;
  hoyre: number;
  total: number;
}

export function MandatBlokk({ venstre, noytral, hoyre, total }: Props) {
  const ruter: { side: "venstre" | "noytral" | "hoyre"; label: string }[] = [
    ...Array.from({ length: venstre }, () => ({ side: "venstre" as const, label: "Venstresiden" })),
    ...Array.from({ length: noytral }, () => ({ side: "noytral" as const, label: "Nøytral" })),
    ...Array.from({ length: hoyre }, () => ({ side: "hoyre" as const, label: "Høyresiden" })),
  ];

  return (
    <div
      className="mandat-blokk"
      role="img"
      aria-label={`Mandatfordeling: ${venstre} på venstresiden, ${noytral} nøytrale, ${hoyre} på høyresiden, av ${total} totalt.`}
    >
      {ruter.map((rute, i) => (
        <span key={i} className={`mandat-rute mandat-rute--${rute.side}`} />
      ))}
    </div>
  );
}
