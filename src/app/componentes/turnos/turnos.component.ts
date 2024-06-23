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

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, FormsModule, MatCheckboxModule, MatButtonToggleModule, SpinnerComponent ],
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
  
  dias: string[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  email: any = "";
  usuario: any;
  esAdmin: boolean = false;

  constructor(private fireStore: FirebaseService) {}

  ngOnInit(): void {
    this.getDatos();
  }

  getDatos() {
    this.generarHorarios();
    this.fechaHoy = this.obtenerFechaHoy();
    this.diaHoy = this.obtenerDiaSemana(new Date());
    console.log("Hoy: ", this.diaHoy + " - " + this.fechaHoy);

    this.calcularQuincena();

    this.fireStore.obtenerDato('especialidades').subscribe(respuesta => {
      this.listaEspecialidades = respuesta;
      this.auxListaEspecialidades = this.listaEspecialidades;
      console.log("especialidades: ", this.listaEspecialidades);
    });

    this.email = localStorage.getItem('user');
    console.log('user', this.email);

    this.fireStore.obtenerDato('usuarios').subscribe(respuesta => {
      this.listaEspecialistas = respuesta.filter(usuario => usuario.tipoUsuario === 'especialista');
      this.auxListaEspecialistas = this.listaEspecialistas;
      console.log("especialistas: ", this.listaEspecialistas);
    });
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
        this.horarios.push(`${horaFormateada}:${minutosFormateados}`);
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
    console.log("Opción seleccionada:", this.diaSeleccionado);
    if (this.diaSeleccionado) {
      this.mostrarDia = true;
    } else {
      this.mostrarDia = false;
    }
  }

  seleccionarHorario() {
    console.log("Opción seleccionada:", this.horarioSeleccionado);
    if (this.horarioSeleccionado) {
      this.mostrarHorario = true;
    } else {
      this.mostrarHorario = false;
    }
  }

  seleccionarEspecialidad() {
    console.log("Especialidad seleccionada:", this.especialidadSeleccionada);
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
    console.log("Opción seleccionada:", this.especialistaSeleccionado);
    if (this.especialistaSeleccionado) {
      this.mostrarEspecialista = true;         
    } else {
      this.mostrarEspecialista = false;
    }
    // if (this.especialistaSeleccionado === "Todos") {
    //   this.refrescar(); 
    // }
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
        diaYHora: `${this.diaSeleccionado.dia} ${this.diaSeleccionado.fecha} ${this.horarioSeleccionado}`,
        estado: 'Pendiente' // por default
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
}