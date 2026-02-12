import { Component, inject } from '@angular/core';
import { CryptoService } from './crypto.service';
import { CryptoCardComponent } from './crypto-card/crypto-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CryptoCardComponent],
  template: `
    <div class="vapor-container">
      <div class="stars"></div>
      <div class="glow-orbs"></div>
      
      <header>
        <h1 class="orbitx-title">OrbitX</h1>
        <p>Actualización cada 1.5 segundos • 5 criptos simuladas</p>
      </header>

      <div class="grid">
        @for (crypto of service.cryptosSignal(); track crypto.id) {
          <app-crypto-card 
            [crypto]="crypto" 
            (cambiarUmbralEvent)="service.actualizarUmbral(crypto.id, $event)" />
        }
      </div>
    </div>
  `,
  styles: [`
    .vapor-container {
      min-height: 100vh;
      background: radial-gradient(ellipse at center, #1a0033 0%, #0d001a 70%, #000000 100%);
      position: relative;
      overflow: hidden;
      padding: 40px 20px;
      font-family: 'Segoe UI', system-ui, sans-serif;
    }

    /* Estrellas sutiles */
    .stars {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: transparent;
      background-image: 
        radial-gradient(2px 2px at 20px 30px, #eee, transparent),
        radial-gradient(2px 2px at 40px 70px, #fff, transparent),
        radial-gradient(1px 1px at 90px 40px, #fff, transparent),
        radial-gradient(1px 1px at 130px 80px, #eee, transparent),
        radial-gradient(2px 2px at 160px 30px, #fff, transparent);
      background-repeat: repeat;
      background-size: 200px 100px;
      animation: sparkle 20s linear infinite;
      opacity: 0.6;
    }

    @keyframes sparkle {
      0% { transform: translateY(0px); }
      100% { transform: translateY(-200px); }
    }

    /* Orbes de luz suaves (el toque mágico) */
    .glow-orbs::before, .glow-orbs::after {
      content: '';
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
      animation: float 25s infinite linear;
    }

    .glow-orbs::before {
      width: 600px;
      height: 600px;
      background: #ff79cd;
      top: -200px;
      left: -200px;
    }

    .glow-orbs::after {
      width: 800px;
      height: 800px;
      background: #00f0ff;
      bottom: -300px;
      right: -300px;
      animation-delay: -12s;
    }

    @keyframes float {
      0% { transform: translate(0, 0) rotate(0deg); }
      100% { transform: translate(100px, -100px) rotate(360deg); }
    }

    header {
      text-align: center;
      margin-bottom: 60px;
      position: relative;
      z-index: 2;
    }

    h1 {
      font-size: 3.6rem;
      font-weight: 800;
      margin: 0;
      background: linear-gradient(90deg, #ff79cd, #9d4edd, #00f0ff);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      text-shadow: 0 0 30px rgba(255, 121, 205, 0.5);
    }

    p {
      color: #c9a0ff;
      font-size: 1.3rem;
      letter-spacing: 1px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 35px;
      max-width: 1500px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }
  `]
})
export class AppComponent {
  service = inject(CryptoService);
}