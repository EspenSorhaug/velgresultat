export type Side = "venstre" | "noytral" | "hoyre";

/** Shape of the bits we care about from https://valg.nrk.no/api/2025/st */
export interface NrkPartiResultat {
  parti: {
    id: string;
    kortNavn: string;
    farge: string;
    kategori: number;
  };
  mandater: { antall: number };
}

export interface NrkKonstellasjon {
  navn: string;
  partierIder: string[];
}

export interface NrkResponse {
  mandater: { antall: number };
  partier: NrkPartiResultat[];
  konstellasjoner: NrkKonstellasjon[];
}

/** Flattened party shape sent to the client */
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
