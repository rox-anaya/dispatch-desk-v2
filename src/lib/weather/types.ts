export interface MetarResponse {
  icaoId: string;
  receiptTime: string;
  obsTime: number;
  tempC: number;
  dewpC: number;
  wspdKnots: number;
  wdir: number;
  visibLte: boolean;
  visibStatute: number;
  altimHg: number;
  rawOb: string;
  fltcat: "VFR" | "MVFR" | "IFR" | "LIFR";
}

export interface TafResponse {
  icaoId: string;
  rawTAF: string;
}
