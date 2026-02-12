import { Injectable, signal } from '@angular/core';
import { Crypto } from './models/crypto.model';

@Injectable({ providedIn: 'root' })
export class CryptoService {
  private cryptos = signal<Crypto[]>([
    { 
      id: 'btc', 
      name: 'Bitcoin', 
      symbol: 'BTC', 
      price: 61234.56, 
      changePercent: 0, 
      threshold: 65000, 
      isAlert: false, 
      history: [61234.56],
      logoUrl: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1696501400'
    },
    { 
      id: 'eth', 
      name: 'Ethereum', 
      symbol: 'ETH', 
      price: 2456.78, 
      changePercent: 0, 
      threshold: 2600, 
      isAlert: false, 
      history: [2456.78],
      logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1696501628'
    },
    { 
      id: 'sol', 
      name: 'Solana', 
      symbol: 'SOL', 
      price: 142.35, 
      changePercent: 0, 
      threshold: 150, 
      isAlert: false, 
      history: [142.35],
      logoUrl: 'https://assets.coingecko.com/coins/images/4128/small/solana.png?1696504756'
    },
    { 
      id: 'ada', 
      name: 'Cardano', 
      symbol: 'ADA', 
      price: 0.58, 
      changePercent: 0, 
      threshold: 0.70, 
      isAlert: false, 
      history: [0.58],
      logoUrl: 'https://assets.coingecko.com/coins/images/975/small/cardano.png?1696502150'
    },
    { 
      id: 'xrp', 
      name: 'XRP', 
      symbol: 'XRP', 
      price: 0.62, 
      changePercent: 0, 
      threshold: 0.70, 
      isAlert: false, 
      history: [0.62],
      logoUrl: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png?1696501442'
    },
  ]);

  readonly cryptosSignal = this.cryptos.asReadonly();

  private worker!: Worker;

  constructor() {
    this.worker = new Worker(
      new URL('./price-calculator.worker', import.meta.url),
      { type: 'module' }
    );

    this.worker.onmessage = (event) => {
      const results = event.data;
      this.cryptos.update(list =>
        list.map(crypto => {
          const res = results.find((r: any) => r.id === crypto.id);
          return res ? { ...crypto, ma: res.ma, vol: res.vol } : crypto;
        })
      );
    };

    // Actualización cada 1.5 segundos (1500 ms)
    setInterval(() => this.simularActualizacionPrecios(), 1500);
  }

  private simularActualizacionPrecios() {
    this.cryptos.update(list =>
      list.map(c => {
        const cambio = (Math.random() - 0.5) * 0.04; // ±2%
        const nuevoPrecio = c.price * (1 + cambio);
        const changePercent = ((nuevoPrecio - c.price) / c.price) * 100;

        let history = [...c.history, nuevoPrecio];
        if (history.length > 30) history.shift();

        const isAlert = nuevoPrecio > c.threshold;

        return {
          ...c,
          price: nuevoPrecio,
          changePercent,
          history,
          isAlert,
        };
      })
    );

    const dataParaWorker = this.cryptos().map(c => ({
      id: c.id,
      prices: c.history
    }));
    this.worker.postMessage({ cryptos: dataParaWorker });
  }

  actualizarUmbral(id: string, nuevoUmbral: number) {
    this.cryptos.update(list =>
      list.map(c => c.id === id ? { ...c, threshold: nuevoUmbral } : c)
    );
  }
}