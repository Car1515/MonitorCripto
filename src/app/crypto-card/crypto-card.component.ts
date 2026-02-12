import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Crypto } from '../models/crypto.model';
import { HighlightChangeDirective } from '../highlight-change.directive';

@Component({
  selector: 'app-crypto-card',
  standalone: true,
  imports: [CommonModule, HighlightChangeDirective],
  template: `
    <div class="card" [class.alert]="crypto.isAlert">
      <h2>
        <img [src]="crypto.logoUrl" alt="{{ crypto.name }} logo" class="logo" />
        {{ crypto.name }} 
        <span class="symbol">({{ crypto.symbol }})</span>
      </h2>

      <div class="price"
           [appHighlightChange]="crypto.price"
           [class.up]="crypto.changePercent > 0"
           [class.down]="crypto.changePercent < 0">
        \${{ crypto.price | number:"1.2-2" }}
      </div>

      <div class="change"
           [class.up]="crypto.changePercent > 0"
           [class.down]="crypto.changePercent < 0">
        {{ crypto.changePercent | number:"1.2-2" }}%
      </div>

      <div class="umbral">
        Umbral:
        <input type="number"
               [value]="crypto.threshold"
               (change)="cambiarUmbral($event)"
               step="0.01">
      </div>

      <div class="info" *ngIf="crypto.ma !== undefined">
        MA: {{ crypto.ma | number:"1.2-2" }} | Vol: {{ crypto.vol | number:"1.2-2" }}
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 20px;
      color: #e2e8f0;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      transition: all 0.2s;
    }
    .card:hover { transform: translateY(-4px); }
    .card.alert { border-color: #facc15; box-shadow: 0 0 20px #facc15; }

    .logo {
      width: 28px;
      height: 28px;
      vertical-align: middle;
      margin-right: 10px;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(255,255,255,0.3);
    }

    .price { font-size: 2.2rem; font-weight: bold; margin: 10px 0; }
    .up { color: #22c55e; }
    .down { color: #ef4444; }

    .symbol { color: #94a3b8; font-size: 1rem; }
    .change { font-size: 1.3rem; font-weight: 600; }

    .umbral input {
      background: #334155;
      border: none;
      color: white;
      padding: 6px 10px;
      border-radius: 6px;
      width: 110px;
    }

    .info { margin-top: 12px; color: #94a3b8; font-size: 0.95rem; }

    @keyframes flashGreen { 0% { background: #22c55e33; } 100% { background: transparent; } }
    @keyframes flashRed   { 0% { background: #ef444433; } 100% { background: transparent; } }
    .flash-green { animation: flashGreen 0.7s; }
    .flash-red   { animation: flashRed 0.7s; }
  `]
})
export class CryptoCardComponent {
  @Input() crypto!: Crypto;
  @Output() cambiarUmbralEvent = new EventEmitter<number>();

  cambiarUmbral(event: Event) {
    const input = event.target as HTMLInputElement;
    const valor = parseFloat(input.value);
    if (!isNaN(valor)) {
      this.cambiarUmbralEvent.emit(valor);
    }
  }
}