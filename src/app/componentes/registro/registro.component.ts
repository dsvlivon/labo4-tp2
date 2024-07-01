import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { MatButtonToggleModule} from '@angular/material/button-toggle';
import { CloudStorageService } from '../../services/cloud-storage.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { MatIconModule } from '@angular/material/icon';

enum TipoRol {
  admin = 'admin',
  Otros = 'otros'
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, FormsModule, MatIconModule, MatCheckboxModule, MatButtonToggleModule, SpinnerComponent ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  email: any = "";
  clave: string = "";
  usuario: any;
  checked: boolean = false;
  checked2: boolean = false;
  mensaje: string = "";
  formRegistro: FormGroup;
  formEspecialidad: FormGroup;
  validationUserMessage = { type: 'errorType', message: 'El email es incorrecto. Pruebe nuevamente' }
  validationFormUser: FormGroup = new FormGroup({});
  rol: TipoRol = TipoRol.Otros;
  tiposRol: string[] = Object.values(TipoRol);
  lista: any[] = []; 
  especialidades: string[] = Object.values(this.lista);
  auxEspecialidades: string[] = [];
  opcionSeleccionada: string = '';
  tipoUsuario = "paciente";
  estadoAcceso = "aprobado";

  mostrarSpinner: boolean = false;
  mostrarNuevaEspecialidad: boolean = false;
  mostrarMensaje: boolean = false;
  esAdmin: boolean = false;
  
  mostrarEspecialidad: boolean = false;
  mostrarObraSocial: boolean = true;
  mostrarFoto2: boolean = true;
  imageUrl: string = "";
  

  constructor(
    private userService: AuthService,
    private router: Router,
    public formBuilder: FormBuilder,
    private fireStore: FirebaseService,
    private cloudStorage: CloudStorageService
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
    this.getDatos();
  }

  getDatos() {
    // this.getImagen('perfiles', 'prueba');
    this.fireStore.obtenerDato('especialidades').subscribe(respuesta => {
      this.lista = respuesta;
      console.log("especialidades: ", this.lista);
    });

    this.email = localStorage.getItem('user');
    console.log('user', this.email);
    this.fireStore.obtenerDatoPorCriterio('usuarios', 'email', this.email).subscribe(data => {
      this.usuario = data[0];
      if (this.usuario) {
        if(this.usuario.tipoUsuario === 'admin') {
          this.esAdmin = true;
          // this.mostrarAdmin = true;
          console.log("esAdminx:", this.esAdmin );
        }
      }
    }); 
  }

  yaEsUsuario() {
    // this.mostrarRegistro = !this.mostrarRegistro;
    this.router.navigate(['/login']);
    return false;
  }

  onRegistrar() {
    this.mostrarSpinner = true;
    if (this.formRegistro.valid) { 
        this.userService.registrarConVerificacion(this.formRegistro.value).then(response => {
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
          'especialidad': this.auxEspecialidades || ''
        };
        this.fireStore.setData(obj, 'usuarios');   
        // localStorage.setItem('user', this.formRegistro.value['email']);
        console.log("Guardar usuario:", obj);
        if(!this.esAdmin) {
          this.router.navigate(['/login']);
        } else {
          this.router.navigate(['/home']);
        }
      }, 1500);      
    }
    this.mostrarSpinner = false;
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

  selectorTipoDeUsuario(tipo: string) {
    this.tipoUsuario=tipo;
    console.log("tipoUsuario: ", this.tipoUsuario);
    
    if (this.tipoUsuario == "especialista") {
      this.estadoAcceso = "pendiente";
      this.mostrarEspecialidad = true;
      this.mostrarFoto2 = false;
      this.mostrarObraSocial = false;
    } else if (this.tipoUsuario == "admin") {
      this.estadoAcceso = "aprobado";
      this.mostrarEspecialidad = false;
      this.mostrarFoto2 = false;
      this.mostrarObraSocial = false;
    } else {
      this.estadoAcceso = "aprobado";
      this.mostrarEspecialidad = false;
      this.mostrarFoto2 = true;
      this.mostrarObraSocial = true;
    }
  }

  seleccionarOpcion() {
    if(this.opcionSeleccionada == "Nuevo") {
      this.mostrarNuevaEspecialidad = true;
    } else {
      this.mostrarNuevaEspecialidad = false;
      this.auxEspecialidades.push(this.opcionSeleccionada)
      console.log("Opciónes: ", this.auxEspecialidades);
    }   
  }

  agregarEspecialidad(){
    this.opcionSeleccionada = "";
  }

  async onFileChange(event: any, img: string) {
    let codigo = this.generarCodigoAleatorio();
    this.mostrarSpinner = true;
    console.log("codigo: ", codigo)
    const file = event.target.files[0];
    if (file) {
      try {
        this.imageUrl = await this.cloudStorage.subirImagenAsync("perfiles", codigo, file);
        console.log("url subido: ", this.imageUrl);
        this.formRegistro.patchValue({[img]: this.imageUrl});
        this.mostrarSpinner = false;
      } catch (error) {
        console.error('Error al subir la imagen:', error);
      }
    }
  }
  
  async getImagen(carpeta: string, nombre: string) {
    this.mostrarSpinner = true;
    try {
      this.imageUrl = await this.cloudStorage.getImagenAsync(carpeta, nombre);
      console.log('URL de la imagen:', this.imageUrl);
      this.mostrarSpinner = false;
    } catch (error) {
      console.error('Error al obtener la imagen:', error);
    }
  }

  generarCodigoAleatorio(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let codigo = '';
    for (let i = 0; i < 10; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
      codigo += caracteres.charAt(indiceAleatorio);
    }
    return codigo;
  }
}
  
