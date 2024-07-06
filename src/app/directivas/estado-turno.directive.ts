import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appEstadoTurno]',
  standalone: true
})
export class EstadoTurnoDirective implements OnChanges {
  @Input() appEstadoTurno: string = '';

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
    this.el.nativeElement.style.color = 'white';

    if (this.appEstadoTurno === 'Aprobado') {
      this.el.nativeElement.style.backgroundColor = 'green';
    } else if (this.appEstadoTurno === 'Pendiente') {
      this.el.nativeElement.style.backgroundColor = 'orange';
    } else if (this.appEstadoTurno === 'Realizado') {
      this.el.nativeElement.style.backgroundColor = 'blue';
    } else if (this.appEstadoTurno === 'Cancelado') {
    this.el.nativeElement.style.backgroundColor = 'red';  
    } else { 
      this.el.nativeElement.style.backgroundColor = '';
    }
  }
}
