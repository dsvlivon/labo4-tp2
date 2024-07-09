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
import { RegistroComponent } from '../registro/registro.component';
import { MisTurnosComponent } from '../mis-turnos/mis-turnos.component';
import { SaludoPipe } from '../../pipes/saludo.pipe';
import { HistoriaClinicaComponent } from '../historia-clinica/historia-clinica.component';
import { PacientesComponent } from '../pacientes/pacientes.component';
import { MiPerfil2Component } from '../mi-perfil2/mi-perfil2.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatProgressSpinnerModule, CommonModule, HabilitarUsuariosComponent, 
    RegistroComponent, MisTurnosComponent, SaludoPipe, HistoriaClinicaComponent, PacientesComponent, MiPerfil2Component],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  mostrarConfirmacion: boolean = true;
  mostrarHabilitar: boolean = false;
  mostrarRegistro: boolean = false;
  mostrarTurnos: boolean = true;
  mostrarMisTurnos: boolean = false;
  esAdmin: boolean = false;
  email: any;
  usuario: any;
  @Input() mostrarSpinner: any;
  authSrv = inject(AuthService);

  mostrarMiPerfil2: boolean = false;
  mostrarPacientes: boolean = false;
  mostrarIconoPacientes: boolean = false;
  mostrarHistoriaClinica: boolean = false;
  pacienteElegido: string = "";
  pacienteId: string= "";

  constructor(
    private fireStore: FirebaseService,
    private authService: AuthService,
    private router: Router
  ){}


  ngOnInit(): void {
    this.email = localStorage.getItem('user');
    // console.log('user', this.email);
    this.fireStore.obtenerDatoPorCriterio('usuarios', 'email', this.email).subscribe(data => {
      this.usuario = data[0];
      if (this.usuario) {
        if(this.usuario.estadoAcceso === 'aprobado') {
          this.mostrarConfirmacion = false; 
        }
        if(this.usuario.tipoUsuario === 'admin') {
          this.esAdmin = true;
        }
        if(this.usuario.tipoUsuario === 'especialista') {
          this.mostrarTurnos = false;
          this.mostrarMisTurnos = true;
          this.mostrarIconoPacientes = true;
        }
      }
      // console.log('Usuariox:', this.usuario);
    });    
  }

  goLogOut() { 
    this.mostrarSpinner = true; 
    // console.log("spinner: ", this.mostrarSpinner)
    setTimeout(() => {
      this.authService.logout()
      this.mostrarSpinner = false;
      // console.log("spinner: ", this.mostrarSpinner)
      this.router.navigateByUrl('bienvenido', { replaceUrl: true})
    }, 1500);
  }
  
  goHome() { 
    this.mostrarMisTurnos = false;
    this.mostrarHabilitar = false;
    this.mostrarRegistro = false;
    this.mostrarPacientes = false;
    this.mostrarHistoriaClinica = false;
    this.mostrarMiPerfil2 = false;
    this.router.navigate(['/home']);
  }

  goVolver() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

  goTurnos() {
    this.router.navigate(['/turnos'], { replaceUrl: true });
  }
  goMisTurnos() {
    this.mostrarMisTurnos = !this.mostrarMisTurnos;
    
    this.mostrarHabilitar = false;
    this.mostrarRegistro = false;
    this.mostrarPacientes = false;
    this.mostrarHistoriaClinica = false;
    this.mostrarMiPerfil2 = false;
  }

  goUsuarios() {
    this.mostrarHabilitar = !this.mostrarHabilitar;
    
    this.mostrarRegistro = false;
    this.mostrarMisTurnos = false;
    this.mostrarPacientes = false;
    this.mostrarHistoriaClinica = false;
    this.mostrarMiPerfil2 = false;
  }

  goPacientes() {
    this.mostrarPacientes = !this.mostrarPacientes;
    
    this.mostrarMisTurnos = false;
    this.mostrarHabilitar = false;
    this.mostrarRegistro = false;
    this.mostrarHistoriaClinica = false;
    this.mostrarMiPerfil2 = false;
   }

  goRegistro() {
    // this.router.navigateByUrl('/registro', { replaceUrl: true });
    this.mostrarRegistro = !this.mostrarRegistro;
    
    this.mostrarMisTurnos = false;
    this.mostrarHabilitar = false;
    this.mostrarPacientes = false;
    this.mostrarHistoriaClinica = false;
    this.mostrarMiPerfil2 = false;
  }

  goMiPerfil() {
    if(this.usuario.tipoUsuario == 'especialista'){
      this.router.navigateByUrl('/miPerfil', { replaceUrl: true });
    } else {
      this.mostrarMiPerfil2 = !this.mostrarMiPerfil2;
      
      this.mostrarMisTurnos = false;
      this.mostrarHabilitar = false;
      this.mostrarRegistro = false;
      this.mostrarPacientes = false;
      this.mostrarHistoriaClinica = false;     
    }
  } 

  mostrarHistoria(id: string) {
    this.pacienteElegido = id;
    this.pacienteId = id;
    this.mostrarHistoriaClinica = !this.mostrarHistoriaClinica;
  
    this.mostrarPacientes = false;
    this.mostrarMiPerfil2 = false;
    this.mostrarMisTurnos = false;
    this.mostrarHabilitar = false;
    this.mostrarRegistro = false;
  }

}
