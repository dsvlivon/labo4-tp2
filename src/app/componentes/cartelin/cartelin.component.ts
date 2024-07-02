import { Component, Input } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-cartelin',
  standalone: true,
  imports: [],
  templateUrl: './cartelin.component.html',
  styleUrl: './cartelin.component.css',
  animations: [
    trigger('animacionColapso', [
      state('expandido', style({
        width: '100%',
      })),
      state('colapsado', style({
        width: '0',
      })),
      transition('expandido <=> colapsado', [
        animate('0.5s ease-in-out')
      ]),
    ]),
  ],
})
export class CartelinComponent {
  estadoDiv: string = 'expandido'; // Inicialmente expandido

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.estadoDiv = 'colapsado'; // Cambia a colapsado después de x tiempo
    }, 5000); // Por ejemplo, colapsa después de 5 segundos
  }
}
