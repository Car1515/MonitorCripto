export interface Crypto {
  id: string;
  name: string;
  symbol: string;
  price: number;
  changePercent: number;
  threshold: number;
  isAlert: boolean;
  history: number[];
  ma?: number;
  vol?: number;
  logoUrl: string;   // URL del logo oficial de la criptomoneda
}