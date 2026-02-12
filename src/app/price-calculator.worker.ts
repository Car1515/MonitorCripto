/// <reference lib="webworker" />

addEventListener('message', (event) => {
  const { cryptos } = event.data;

  const resultados = cryptos.map((item: any) => {
    const prices = item.prices;
    if (prices.length < 2) {
      return { id: item.id, ma: prices[0] || 0, vol: 0 };
    }

    const ma = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;

    const mean = ma;
    const variance = prices.reduce((a: number, b: number) => a + Math.pow(b - mean, 2), 0) / prices.length;
    const vol = Math.sqrt(variance);

    return { id: item.id, ma, vol };
  });

  postMessage(resultados);
});