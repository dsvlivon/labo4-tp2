import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatProgressSpinnerModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  mostrarComponente: boolean = false;
  mostrarColapsar: boolean = false;
  mostrarBotonesFlotantes = false;
  @Input() mostrarSpinner: any;
  authSrv = inject(AuthService);


  constructor(
    private router: Router,
    private authService: AuthService
  ){ }
  

  goLogOut() { 
    this.mostrarSpinner = true; 
    console.log("spinner: ", this.mostrarSpinner)
    setTimeout(() => {
      this.authService.logout()
      this.mostrarSpinner = false;
      console.log("spinner: ", this.mostrarSpinner)
      this.router.navigateByUrl('bienvenido', { replaceUrl: true})
    }, 3000);
  }
  
  goHome() { 
    this.router.navigate(['/home']);
  }

  goVolver() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }



  expandir() {
    this.mostrarComponente = true;
    this.mostrarColapsar = true;
  }

  colapsar() {
    this.mostrarComponente = false;
    this.mostrarColapsar = false;
  }
}