import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { HabilitarUsuariosComponent } from '../habilitar-usuarios/habilitar-usuarios.component';
import { RegistroComponent } from '../registro/registro.component';

@Component({
  selector: 'app-bienvenido',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatProgressSpinnerModule, CommonModule, HabilitarUsuariosComponent, RegistroComponent],
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
