import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appEstadoAcceso]',
  standalone: true
})
export class EstadoAccesoDirective implements OnChanges {
  @Input() appEstadoAcceso: string = '';

  constructor(private el: ElementRef) {}

  ngOnChanges() {
    this.updateBackgroundColor();
  }

  private updateBackgroundColor() {
    this.el.nativeElement.style.fontFamily = 'Arial, sans-serif';
    this.el.nativeElement.style.display= 'flex';
    this.el.nativeElement.style.justifyContent = 'center'; 
    this.el.nativeElement.style.alignItems = 'center';
    this.el.nativeElement.style.height = '70px';
    this.el.nativeElement.style.marginTop = '20px';

    if (this.appEstadoAcceso === 'aprobado') {
      this.el.nativeElement.style.backgroundColor = 'green';
    } else if (this.appEstadoAcceso === 'pendiente') {
      this.el.nativeElement.style.backgroundColor = 'orange';
    } else {
      this.el.nativeElement.style.backgroundColor = '';
    }
  }
}
