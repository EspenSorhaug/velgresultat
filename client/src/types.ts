export type Side = "venstre" | "noytral" | "hoyre";

export interface Parti {
  id: string;
  kortNavn: string;
  farge: string;
  mandater: number;
  defaultSide: Side;
}

export interface ResultatPayload {
  totalMandater: number;
  majorityThreshold: number;
  parties: Parti[];
  updatedAt: string;
}

export const SIDER: { key: Side; label: string }[] = [
  { key: "venstre", label: "Venstresiden" },
  { key: "noytral", label: "Nøytral" },
  { key: "hoyre", label: "Høyresiden" },
];
