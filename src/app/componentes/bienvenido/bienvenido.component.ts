import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bienvenido',
  standalone: true,
  imports: [],
  templateUrl: './bienvenido.component.html',
  styleUrl: './bienvenido.component.css'
})
export class BienvenidoComponent {
  
  constructor(
    private router: Router,
  ){}
    
  
  goLogin() {
    this.router.navigate(['/login']);
  }
  goRegistro() {
    this.router.navigate(['/registro']);
  }
  

}
