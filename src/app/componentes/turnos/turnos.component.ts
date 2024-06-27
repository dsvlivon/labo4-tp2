import { formatDate } from '@angular/common';
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
import { Turnos } from '../../models/turnos.interface';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, MatIconModule, FormsModule, MatCheckboxModule, MatButtonToggleModule, SpinnerComponent ],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css'
})
export class TurnosComponent implements OnInit{
  diaSeleccionado: any;
  horarioSeleccionado: any;
  especialistaSeleccionado: any;
  especialidadSeleccionada: any;

  mostrarEspecialidad: boolean = false;
  mostrarEspecialista: boolean = false;
  mostrarDia: boolean = false;
  mostrarHorario: boolean = false;

  fechaHoy: string = "";
  diaHoy: string = "";
  mesHoy: string = "";
  horarios: string[] = [];
  
  listaEspecialidades: any[] = [];
  auxListaEspecialidades: any[] = [];
  listaEspecialistas: any[] = [];
  auxListaEspecialistas: any[] = [];
  fechasQuincena: { fecha: string, dia: string }[] = [];
  especialidades: string[] = [];
  especialistas: any[] = [];
  turnos: any[] = [];
  
  dias: string[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  email: any = "";
  usuario: any;
  esAdmin: boolean = false;

  constructor(
    private fireStore: FirebaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getDatos();
  }

  getDatos() {
    
    this.fechaHoy = this.obtenerFechaHoy();
    this.diaHoy = this.obtenerDiaSemana(new Date());
    // console.log("Hoy: ", this.diaHoy + " - " + this.fechaHoy);

    this.calcularQuincena();

    this.email = localStorage.getItem('user');
    this.fireStore.obtenerDatoPorCriterio('usuarios', 'email', this.email).subscribe(data => {
      this.usuario = data[0];
      console.log('Usuario:', this.usuario);
    });    


    this.fireStore.obtenerDato('especialidades').subscribe(respuesta => {
      this.listaEspecialidades = respuesta;
      this.auxListaEspecialidades = this.listaEspecialidades;
      // console.log("especialidades: ", this.listaEspecialidades);
    });

    this.email = localStorage.getItem('user');
    // console.log('user', this.email);

    this.fireStore.obtenerDato('usuarios').subscribe(respuesta => {
      this.listaEspecialistas = respuesta.filter(usuario => usuario.tipoUsuario === 'especialista' && usuario.estadoAcceso === 'aprobado');
      this.auxListaEspecialistas = this.listaEspecialistas;
      // console.log("especialistas: ", this.listaEspecialistas);
    });

    this.fireStore.obtenerDato('turnos').subscribe(respuesta => {
      this.turnos = respuesta;
      console.log("turnos: ", this.turnos);
    });
  }

  verificarDisponibilidadEspecialista(horario: any): boolean {
    for (const turno of this.turnos) {
      if (this.especialistaSeleccionado.id === turno.especialista.id) {
        const dia = this.diaSeleccionado.dia + " " + this.diaSeleccionado.fecha;
        if (turno.dia === dia && turno.hora === horario) {
          return false;
        }
      }
    }
    return true;
  }
  

  calcularQuincena() {
    const hoy = new Date();
    for (let i = 0; i < 15; i++) {
      const nuevaFecha = new Date(hoy);
      nuevaFecha.setDate(hoy.getDate() + i);
      const fechaFormateada = formatDate(nuevaFecha, 'dd', 'en-AR');
      this.mesHoy = formatDate(nuevaFecha, 'MM', 'en-AR');
      const diaSemana = this.obtenerDiaSemana(nuevaFecha);
      this.fechasQuincena.push({ fecha: fechaFormateada, dia: diaSemana });
    }
  }

  generarHorarios() {
    const intervalosMinutos = 30;
    const horaInicio = 9;
    const horaFin = 18;

    for (let hora = horaInicio; hora < horaFin; hora++) {
      for (let minutos = 0; minutos < 60; minutos += intervalosMinutos) {
        const horaFormateada = hora < 10 ? `0${hora}` : `${hora}`;
        const minutosFormateados = minutos < 10 ? `0${minutos}` : `${minutos}`;
        let horario = `${horaFormateada}:${minutosFormateados}`;
        if(this.verificarDisponibilidadEspecialista(horario)){
          this.horarios.push(horario);
        }
      }
    }
  }

  obtenerFechaHoy(): string {
    const hoy = new Date();
    return formatDate(hoy, 'dd/MM/yyyy', 'en-AR');
  }

  obtenerDiaSemana(fecha: Date): string {
    return this.dias[fecha.getDay()];
  }

  seleccionarDia() {
    // console.log("Opción seleccionada:", this.diaSeleccionado);
    if (this.diaSeleccionado) {
      if(this.diaSeleccionado === this.diaHoy){
        this.horarios.filter(obj => obj >= this.fechaHoy);
      }
      this.mostrarDia = true;
    } else {
      this.mostrarDia = false;
    }
    this.generarHorarios();
  }

  seleccionarHorario() {
    // console.log("Opción seleccionada:", this.horarioSeleccionado);
    if (this.horarioSeleccionado) {
      this.mostrarHorario = true;
    } else {
      this.mostrarHorario = false;
    }
  }

  seleccionarEspecialidad() {
    // console.log("Especialidad seleccionada:", this.especialidadSeleccionada);
    if (this.especialidadSeleccionada) {
      this.refrescar(); 
      this.listaEspecialistas = this.listaEspecialistas.filter(obj => obj.especialidad === this.especialidadSeleccionada);
      this.mostrarEspecialidad = true;
    } else {
      this.mostrarEspecialidad = false;
    }
    if (this.especialidadSeleccionada === "Todos") {
      this.refrescar(); 
    }
  }
  
  seleccionarEspecialista() {
    console.log("Especialista seleccionada:", this.especialistaSeleccionado);
    if (this.especialistaSeleccionado) {
      this.mostrarEspecialista = true;         
    } else {
      this.mostrarEspecialista = false;
    }
  }

  refrescar() {
    this.listaEspecialidades = this.auxListaEspecialidades;
    this.listaEspecialistas = this.auxListaEspecialistas;
  }

  confirmarTurno() {
    if (this.especialidadSeleccionada && this.especialistaSeleccionado && this.diaSeleccionado && this.horarioSeleccionado) {
      const obj: Turnos = {
        especialidad: this.especialidadSeleccionada,
        especialista: this.especialistaSeleccionado,
        dia:`${this.diaSeleccionado.dia} ${this.diaSeleccionado.fecha}`,
        hora: this.horarioSeleccionado,
        estado: 'Pendiente', // por default
        paciente: this.usuario
      };
      this.fireStore.setData(obj, 'turnos');   
      console.log('Nuevo turno creado:', obj);      
    } else {
      console.log('Faltan datos para crear el turno');
    }
  }

  cancelarTurno() {
    this.especialistaSeleccionado = null;
    this.especialidadSeleccionada = null;
    this.diaSeleccionado = null;
    this.horarioSeleccionado = null;

    this.mostrarEspecialista = false;
    this.mostrarEspecialidad = false;
    this.mostrarDia = false;
    this.mostrarHorario = false;
  }

  goHome() { 
    this.router.navigate(['/home']);
  }
}