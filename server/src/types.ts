export type Side = "venstre" | "noytral" | "hoyre";

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
