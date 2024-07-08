import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-detalle-turno',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './detalle-turno.component.html',
  styleUrl: './detalle-turno.component.css'
})
export class DetalleTurnoComponent implements OnChanges, OnInit {
  @Input() obj: any;
  mostrarDetalle: boolean = true;
  especialidades: string[] = [];
  email: any;
  usuario: any;
  comentario: any;
  resena: any;
  
  mostrarHacerEncuesta: boolean = false;
  mostrarHacerCalificar: boolean = false;
  mostrarEncuesta: boolean = false;
  mostrarCalificar: boolean = false;
  
  mensaje:string = "";
  accion:string = "";
  accionBoton:string = "";
  mostrarDejarResena: boolean = false;
  mostrarDejarComment: boolean = false;
  mostrarOtrosBotones: boolean = false;
  mostrarBotones: boolean = false;
  mostrarResena: boolean = false;
  mostrarComentario: boolean = false;

  rating: number = 0;
  stars: boolean[] = [false, false, false, false, false];

  preguntas: string[] = [
    '¿El personal fue amable y cortés?',
    '¿Qué tan satisfecho está con la atención recibida?',
    '¿Nuestras Instalaciones estaban limpias y prolijas?',
    '¿Volvería a atenderse con este médico?'
  ];

  respuestas: string[] = ['Si', 'Tal vez', 'No'];

  encuesta: any = {
    '¿El personal fue amable y cortés?': '',
    '¿Qué tan satisfecho está con la atención recibida?': '',
    '¿Nuestras Instalaciones estaban limpias y prolijas?': '',
    '¿Volvería a atenderse con este médico?': ''
  };
  
  mostrarHacerHistoria: boolean = false;
  mostrarHistoria: boolean = false;
  formHistoria: FormGroup;
  historiaClinica: any;

  constructor(
    private fireStore: FirebaseService,
    public formBuilder: FormBuilder
  ) {
    this.formHistoria = this.formBuilder.group({
      // paciente: new FormControl(),
      // especialista: new FormControl(),
      altura: ['', [Validators.required]],
      peso: ['', [Validators.required]],
      temperatura: ['', [Validators.required]],
      presion: ['', [Validators.required]],
      clave1:['', [Validators.required]],
      value1:['', [Validators.required]],
      clave2: new FormControl(),
      value2: new FormControl(),
      clave3: new FormControl(),
      value3: new FormControl()
    })
  }

  ngOnInit(): void {
    if(this.obj.comentario != null){ 
      this.mostrarResena = true; 
    }

    this.email = localStorage.getItem('user');
    this.fireStore.obtenerDatoPorCriterio('usuarios', 'email', this.email).subscribe(data => {
      this.usuario = data[0];
      // console.log('Usuario:', this.usuario);
      
      this.fireStore.obtenerDatoPorCriterio('historiaClinica', 'id', this.obj.paciente.id).subscribe(data => {
        this.historiaClinica = data[0];
        // console.log('Usuario:', this.usuario);
        this.seteoSegunUsuario();        
      });
    });
  }

  seteoSegunUsuario(){
    if(this.usuario.tipoUsuario == "admin") {
      if(this.obj.estado == "Pendiente") {
        this.accion = "Cancelado"; 
        this.accionBoton = "CANCELAR"
        this.mostrarDejarComment = true;
        this.mensaje = "Desea dejar un commentario? "
        this.mostrarBotones = true;
      }
    }

    if(this.usuario.tipoUsuario == "paciente") {
      if(this.obj.estado == "Pendiente") {
        this.accion = "Cancelado"; 
        this.accionBoton = "CANCELAR"
        this.mostrarDejarComment = true;
        this.mostrarBotones = true;
        this.mensaje = "Desea dejar un commentario? "
      } else if(this.obj.resena ){
        this.mostrarResena = true;
      }
      if(this.obj.estado== "Realizado"){
        this.mostrarHacerEncuesta = true; 
        this.mostrarHacerCalificar = true;
        
        if(this.obj.calificacion) {
          this.mostrarHacerCalificar = false;
        }
        if(this.obj.resena) { 
          this.mostrarHacerEncuesta = true;
          if(this.obj.encuesta) {
            this.mostrarHacerEncuesta = false;
          }
        }
      }
    }

    if(this.usuario.tipoUsuario == "especialista") {
      this.mostrarBotones = true;
      this.mostrarHacerEncuesta = false;
      this.mostrarCalificar = false;
      this.mostrarDejarComment = false;
      
      if(this.obj.estado == "Pendiente") {
        this.accion = "Aceptado"; 
        this.accionBoton = "ACEPTAR"
        this.mostrarOtrosBotones = true
        this.mostrarBotones = false;
        
      } else if(this.obj.estado == "Aceptado") {
        this.accion = "Realizado"; 
        this.accionBoton = "FINALIZAR"
        this.mostrarDejarResena = true;
        this.mostrarOtrosBotones = false;

      } else if(this.obj.estado == "Realizado") {
        this.mostrarDejarResena = false;
        this.mostrarOtrosBotones = false;
        this.mostrarBotones = false;
        this.mostrarResena = true;    
    
        if(this.verificarHistoria()) { 
          //aca habria q ver si el turno ya fue dejado en la historia
          this.mostrarHacerHistoria = false;
        } else { this.mostrarHacerHistoria = true; }

      } else {
        this.mostrarDejarResena = false;
        this.mostrarOtrosBotones = false;
        this.mostrarBotones = false;
        this.mostrarComentario = true;
        this.mostrarResena = false;
      }
    }
  }
  
  verificarHistoria(): boolean {
    if(!this.historiaClinica) {return false; }
    return this.historiaClinica.atenciones.some((element: { id: any }) => {
      return element.id === this.obj.id;
    });
  }
  

  ngOnChanges() {     
    if(this.usuario.tipoUsuario == "admin") {
      if(this.obj.estado == "Pendiente") {
        this.accion = "Cancelado"; 
        this.accionBoton = "CANCELAR"
        this.mostrarDejarComment = true;
        this.mensaje = "Desea dejar un commentario? "
      }
    }
    
    if(this.usuario.tipoUsuario == "paciente") {
      if(this.obj.estado == "Pendiente") {
        this.accion = "Cancelado"; 
        this.accionBoton = "CANCELAR"
        this.mostrarDejarComment = true;
        this.mensaje = "Desea dejar un commentario? "
        this.mostrarBotones = true;
      }
    }

    if(this.usuario.tipoUsuario == "especialista") {
      this.mostrarDejarComment = false;
      if(this.obj.estado == "Pendiente") {
        this.accion = "Aceptado"; 
        this.accionBoton = "ACEPTAR"
        this.mostrarOtrosBotones = true;

      } else if(this.obj.estado == "Aceptado") {
        this.accion = "Realizado"; 
        this.accionBoton = "FINALIZAR"
        this.mostrarDejarResena = true;
        this.mostrarOtrosBotones = false;

      } else if(this.obj.estado == "Realizado"){
        this.mostrarDejarResena = false;
        this.mostrarOtrosBotones = false;
        this.mostrarBotones = false;
        this.mostrarResena = true;
      }      
      
      else {
        this.mostrarDejarResena = false;
        this.mostrarOtrosBotones = false;
        this.mostrarBotones = false;
      }
    }
  }

  cerrarModal() {
    this.mostrarDetalle = false;
  }

  InteractuarTurno(accion: string) {
    if (this.obj && this.obj.id) {
      if (accion === "Cancelado" && this.comentario && this.usuario.tipoUsuario==='paciente') {
          this.fireStore.actualizarTurnos('turnos', this.obj.id, accion, this.comentario, "", 999);
      }
      if (accion === "Cancelado" || accion === "Rechazado" || accion === "Realizado" ) {
        if(this.resena){
          this.fireStore.actualizarTurnos('turnos', this.obj.id, accion, "", this.resena, 999);
        }
      }

      if (accion === "Calificado") {
          this.fireStore.actualizarTurnos('turnos', this.obj.id, "Realizado", this.comentario, "", this.rating);
      }
      
      if (accion === "Encuestado") {
          this.fireStore.actualizarTurnos('turnos', this.obj.id, "Realizado", "", "", 999, this.encuesta);
      }
      
      if (accion === "Aceptado") {
        //actualizarTurnos(coleccion: string, id: string, estado: string, comentario?: string, resena?: string, rate?: number, encuesta?: any) {
        this.fireStore.actualizarTurnos('turnos', this.obj.id, accion, "", "", 999);
      }
      // console.log("Usuario habilitado!");
      this.cerrarModal();
    }
  }

  interactuarComentarios(accion:string){
    this.mostrarDejarResena = true;
    this.mensaje = "Desea dejar una reseña?";
    this.mostrarOtrosBotones = false;
    this.mostrarBotones = true;
    this.accion = accion; 
    if(accion == 'Cancelado'){
      this.accionBoton = "CANCELAR";
    } else if(accion == 'Rechazado'){
      this.accionBoton = "RECHAZAR";
    }
  }

  encuestar(){
    this.mostrarEncuesta = true; 

    this.mostrarHacerEncuesta = !this.mostrarHacerEncuesta;
    this.mostrarHacerCalificar = !this.mostrarHacerCalificar;
  }
  
  calificar(){
    this.mostrarCalificar = true; 
    this.mostrarDejarComment = true;
    
    this.mensaje = "Desea dejar un commentario? ";
    this.mostrarHacerEncuesta = false;
    this.mostrarHacerCalificar = !this.mostrarHacerCalificar;
  }

  rate(star: number) {
    this.rating = star;
  }

  guardarEncuesta() {
    console.log(this.encuesta);
    this.mostrarEncuesta = false;
    this.InteractuarTurno("Encuestado");
  }

  cancelarEncuesta() {   
    this.mostrarEncuesta = false;
  }

  historia(){
    this.mostrarHistoria = true;
  }

  guardarHistoria(){
    const hoy = new Date();
    const atenciones: any[] = [];
    if (this.formHistoria.valid) {
      const datosHistoria = this.formHistoria.value;
      atenciones.push(this.obj);
      let obj = { 
        id: this.obj.paciente.id,
        paciente: this.obj.paciente,
        atenciones: atenciones,
        altura: this.formHistoria.value['altura'],
        peso: this.formHistoria.value['peso'],
        temperatura: this.formHistoria.value['temperatura'],
        presion: this.formHistoria.value['presion'],
        ultimaActualizacion: formatDate(hoy, 'dd/MM/yyyy', 'en-AR'),

        clave1: this.formHistoria.value['clave1'],
        value1: this.formHistoria.value['value1'],
        
        clave2: this.formHistoria.value['clave2']  || '',
        value2: this.formHistoria.value['value2'] || '',

        clave3: this.formHistoria.value['clave3'] || '',
        value3: this.formHistoria.value['value3'] || ''
      }
      
      console.log("xxx: ", obj);
      this.fireStore.setData(obj, 'historiaClinica');
    } else {
      console.log('Formulario inválido');
    }
    this.mostrarHistoria = false;
  }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          

}
