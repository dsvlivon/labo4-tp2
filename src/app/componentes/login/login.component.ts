import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { Usuario } from '../../models/usuarios.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
    NavbarComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = "";
  clave: string = "";

  mostrarLogin: boolean = true;
  mostrarRegistro: boolean = !this.mostrarLogin;
  mostrarMensaje: boolean = false;
  mensaje: string = "";
  formLogin: FormGroup;
  validationUserMessage = { type: 'errorType', message: 'El email es incorrecto. Pruebe nuevamente' }
  validationFormUser: FormGroup = new FormGroup({});
  lista: Usuario[] = [];
  mostrarEspecialidad: boolean = false;
  dataSource: Usuario[] | undefined;

  pacientes: Usuario[] = [];
  especialistas: Usuario[] = [];
  admins: Usuario[] = [];

  constructor(
    private userService: AuthService,
    private router: Router,
    public formBuilder: FormBuilder,
    private fireStore: FirebaseService
  ) {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required]],
      paciente: [false],
      especialista: [false]
    });
  }

  ngOnInit(): void {
    this.getDatos();
  }

  getDatos() {
    this.fireStore.obtenerDato('usuarios').subscribe(respuesta => {
      this.lista = respuesta.map(usuario => {
        if (usuario.imagen1) {
          usuario.imagen1 = this.arreglarImagenes(usuario.imagen1);
        }
        return usuario;
      });
      this.dataSource = this.lista;
  
      // Clasificar usuarios según su tipo
      this.lista.forEach(usuario => {
        if (usuario.tipoUsuario === 'paciente' && this.pacientes.length < 3) {
          this.pacientes.push(usuario);
        } else if (usuario.tipoUsuario === 'especialista' && this.especialistas.length < 2) {
          this.especialistas.push(usuario);
        } else if (usuario.tipoUsuario === 'admin' && this.admins.length < 1) {
          this.admins.push(usuario);
        }
      });
    });
  }

  arreglarImagenes(url: string): string {
    return url.replace(/'/g, '"');
  }
  

  loginRapido(index: number) {
    let usuario: Usuario | undefined;

    if (index < 3) {
      usuario = this.pacientes[index];
    } else if (index < 5) {
      usuario = this.especialistas[index - 3];
    } else if (index === 5) {
      usuario = this.admins[0];
    }

    if (usuario) {
      this.formLogin.patchValue({
        email: usuario.email,
        clave: usuario.password
      });
    }
  }

  onSubmit() {
    this.userService.login(this.formLogin.value)
      .then((response: any) => {
        const email = response.user.email;
        localStorage.setItem('user', email);
        this.router.navigate(['/home']);
      })
      .catch(error => this.setMensaje(error, 2));
  }

  onGoogleLogin() {
    this.userService.loginWithGoogle()
      .then((response: any) => {
        const email = response.user.email;
        localStorage.setItem('user', email);
        this.router.navigate(['/home']);
      })
      .catch((error: any) => console.log('Error -> onClick: ' + error));
  }

  yaEsUsuario() {
    this.mostrarLogin = !this.mostrarLogin;
    this.mostrarRegistro = !this.mostrarRegistro;
    this.router.navigate(['/registro']);

    return false;
  }

  setMensaje(error: any, num: number) {
    this.mostrarMensaje = true;
    switch (error.code) {
      case "auth/invalid-credential":
        this.mensaje = "La contraseña proporcionada no es válida.";
        break;
      case "auth/invalid-email":
        this.mensaje = "El correo electrónico proporcionado no es válido.";
        break;
      case "auth/missing-password":
        this.mensaje = "La contraseña es obligatoria.";
        break;
      case "auth/missing-email":
        this.mensaje = "El correo electrónico es obligatorio.";
        break;
      case "auth/email-already-in-use":
        this.mensaje = "El correo electrónico ya está en uso.";
        break;
      case "NaN":
        this.mensaje = "La contraseña es incorrecta.";
        break;
      default:
        this.mensaje = "Se produjo un error desconocido.";
        console.log(this.mensaje + " Api Response: " + error);
        break;
    }
    setTimeout(() => {
      this.mostrarMensaje = false;
      this.mensaje = "";
    }, 3000);
  }
}
