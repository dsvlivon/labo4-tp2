import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../services/firebase.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { HabilitarUsuariosComponent } from '../habilitar-usuarios/habilitar-usuarios.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatProgressSpinnerModule, CommonModule, HabilitarUsuariosComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  mostrarConfirmacion: boolean = true;
  mostrarHabilitar: boolean = false
  esAdmin: boolean = false;
  email: any;
  usuario: any;
  @Input() mostrarSpinner: any;
  authSrv = inject(AuthService);


  constructor(
    private fireStore: FirebaseService,
    private authService: AuthService,
    private router: Router
  ){}


  ngOnInit(): void {
    this.email = localStorage.getItem('user');
    console.log('user', this.email);
    this.fireStore.obtenerDatoPorCriterio('usuarios', 'email', this.email).subscribe(data => {
      this.usuario = data[0];
      if (this.usuario) {
        if(this.usuario.estadoAcceso === 'aprobado') {
          this.mostrarConfirmacion = false; 
        }
        if(this.usuario.tipoUsuario === 'admin') {
          this.esAdmin = true;
        }
      }
      // console.log('Usuariox:', this.usuario);
    });    
  }

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

  goHabilitar() {
   this.mostrarHabilitar = !this.mostrarHabilitar;
  }
}
