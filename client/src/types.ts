export type Side = "venstre" | "noytral" | "hoyre";

export interface Parti {
  id: string;
  kortNavn: string;
  farge: string;
  mandater: number;
  defaultSide: Side;
}

export interface ResultatViewModel {
  totaltAntallMandater: number;
  flertallTerskel: number;
  partier: Parti[];
  oppdatert: string;
}

export const SIDER: { key: Side; label: string }[] = [
  { key: "venstre", label: "Venstresiden" },
  { key: "noytral", label: "Nøytral" },
  { key: "hoyre", label: "Høyresiden" },
];
