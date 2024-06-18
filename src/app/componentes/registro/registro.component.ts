import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

enum TipoRol {
  admin = 'admin',
  Otros = 'otros'
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
    MatButtonToggleModule
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  email: string = "";
  clave: string = "";
  checked: boolean = false;
  checked2: boolean = false;
  mostrarNuevaEspecialidad: boolean = false;
  mostrarMensaje: boolean = false;
  mensaje: string = "";
  formRegistro: FormGroup;
  formEspecialidad: FormGroup;
  validationUserMessage = { type: 'errorType', message: 'El email es incorrecto. Pruebe nuevamente' }
  validationFormUser: FormGroup = new FormGroup({});
  rol: TipoRol = TipoRol.Otros;
  tiposRol: string[] = Object.values(TipoRol);
  lista: any[] = [];
  mostrarEspecialidad: boolean = false;
  especialidades: string[] = Object.values(this.lista);
  opcionSeleccionada: string = '';
  tipoUsuario = "paciente";
  estadoAcceso = "aprobado";

  constructor(
    private userService: AuthService,
    private router: Router,
    public formBuilder: FormBuilder,
    private fireStore: FirebaseService
  ) {
    this.formRegistro = this.formBuilder.group({
      nombre: new FormControl(),
      apellido: new FormControl(),
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{7,8}$/)]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      obraSocial: new FormControl(), //NO p/ especialista
      email: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required]],
      imagen1: new FormControl(),
      imagen2: new FormControl(),
      especialidad: new FormControl()
    })

    this.formEspecialidad = this.formBuilder.group({
      especialidad: ['', Validators.required]
    });
  }

  get Email() {
    return this.formRegistro.get('email');
  }
  get Edad() {
    return this.formRegistro.get('edad');
  }
  get Dni() {
    return this.formRegistro.get('dni');
  }

  ngOnInit(): void {
    this.mostrarEspecialidad = false;
    this.getDatos();
  }

  getDatos() {
    this.fireStore.obtenerDato('especialidades').subscribe(respuesta => {
      this.lista = respuesta;
      console.log("especialidades: ", this.lista);
    });
  }

  yaEsUsuario() {
    // this.mostrarRegistro = !this.mostrarRegistro;
    this.router.navigate(['/login']);
    return false;
  }

  onRegistrar() {
    if (this.formRegistro.valid) {
      this.userService.registrar(this.formRegistro.value).then(response => {
        const email = response.user.email || "null";
        localStorage.setItem('user', email);
        
      }).catch((error: any) => this.setMensaje(error, 1));   
      
      setTimeout(() => {
        let obj = { 
          'nombre': this.formRegistro.value['nombre'] || '',
          'apellido': this.formRegistro.value['apellido'] || '',
          'edad': this.formRegistro.value['edad'] || '',
          'dni': this.formRegistro.value['dni'] || '',
          'email': this.formRegistro.value['email'] || '',
          'password': this.formRegistro.value['clave'] || '',
          'imagen1': this.formRegistro.value['imagen1'] || '',
          'imagen2': this.formRegistro.value['imagen2'] || '',
          'obraSocial': this.formRegistro.value['obraSocial'] || '',
          'estadoAcceso': this.estadoAcceso,
          'tipoUsuario': this.tipoUsuario,
          'especialidad': this.opcionSeleccionada || ''
        };
        this.fireStore.setData(obj, 'usuarios');
        
        // localStorage.setItem('user', this.formRegistro.value['email']);
        console.log("Guardar usuario:", obj);
        this.router.navigate(['/login']);
      }, 1500);
    }
  }

  onGuardarEspecialidad() {
    this.fireStore.setData(this.formEspecialidad.value, 'especialidades');
    this.opcionSeleccionada = this.formEspecialidad.value.especialidad;
    console.log("Guardar especialidad:", this.formEspecialidad.value.especialidad);
    this.formEspecialidad.reset();
    this.mostrarNuevaEspecialidad = false;
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

  selectorTipoDeUsuario(event: any) {
    if( event.value == "especialista") {
      this.mostrarEspecialidad = true;
      this.estadoAcceso = "pendiente";
    } else {
        this.mostrarEspecialidad = false;
        this.estadoAcceso = "aprobado";
    }
    this.tipoUsuario = event.value;
  }

  seleccionarOpcion() {
    // console.log("Opción seleccionada:", this.opcionSeleccionada);
    if(this.opcionSeleccionada == "Nuevo") {
      this.mostrarNuevaEspecialidad = true;
    } else {
      this.mostrarNuevaEspecialidad = false;
    }
  }
}
  
