import { Directive, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appHighlightChange]',
  standalone: true
})
export class HighlightChangeDirective implements OnChanges {
  @Input() appHighlightChange: number = 0;

  private precioAnterior: number | undefined;

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['appHighlightChange'] && this.precioAnterior !== undefined) {
      const actual = changes['appHighlightChange'].currentValue;
      const diff = actual - this.precioAnterior;

      if (diff > 0) {
        this.el.nativeElement.classList.add('flash-green');
        setTimeout(() => this.el.nativeElement.classList.remove('flash-green'), 600);
      } else if (diff < 0) {
        this.el.nativeElement.classList.add('flash-red');
        setTimeout(() => this.el.nativeElement.classList.remove('flash-red'), 600);
      }
    }
    this.precioAnterior = changes['appHighlightChange']?.currentValue;
  }
}