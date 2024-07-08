import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../models/usuarios.interface';
import { FirebaseService } from '../../services/firebase.service';
import { DetalleComponent } from '../detalle/detalle.component';
import { TiempoService } from '../../services/tiempo.service';
import { EstadoTurnoDirective } from '../../directivas/estado-turno.directive';
import { DetalleTurnoComponent } from '../detalle-turno/detalle-turno.component';

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [MatGridListModule, MatIconModule, MatGridListModule, CommonModule, MatTableModule, DetalleTurnoComponent, EstadoTurnoDirective],
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css']
})
export class MisTurnosComponent implements OnInit {
  @Output() peliculaSeleccionada = new EventEmitter<any>();
  columnas: string[] = [ 'Estado', 'Dia', 'Hora', 'Especialidad', 'Especialista', 'Paciente', 'Obra Social'];

  lista: Usuario[] = [];
  lista2: Usuario[] = [];
  dataSource: Usuario[] = [];
  selectedObj: Usuario | null = null;
  mostrarDetalle: boolean = false;
  usuario: any;
  filtroEspecialidad: any[] = [];
  filtroEspecialista: any[] = [];
  filtroPaciente: any[] = [];

  fechaHoy: string = "";
  diaHoy: string = "";
  mesHoy: string = "";
  horarios: string[] = [];
  email: any;
  turnos: any[] = [];
  auxTurnos: any[] = [];
  especialidadSeleccionada: any;
  especialistaSeleccionado: any;
  pacienteSeleccionado: any;

  mostrarFiltroPaciente: boolean = false;
  mostrarFiltroEspecialista: boolean = false;

  constructor(
    private fireStore: FirebaseService,
    private tiempo: TiempoService
  ) {}

  ngOnInit(): void { this.getDatos(); }

  getDatos() {
    this.fechaHoy = this.tiempo.obtenerFechaHoy();


    this.email = localStorage.getItem('user');
    this.fireStore.obtenerDatoPorCriterio('usuarios', 'email', this.email).subscribe(data => {
      this.usuario = data[0];
      // console.log('Usuario:', this.usuario);
    });

    this.fireStore.obtenerDato('turnos').subscribe(respuesta => {
      this.turnos = respuesta;
      // console.log("turnos: ", this.turnos);
      if(this.usuario.tipoUsuario === 'paciente'){ 
        this.mostrarFiltroEspecialista = true; 
        this.turnos = this.turnos.filter(item => item.paciente.id === this.usuario.id);
      } else if(this.usuario.tipoUsuario === 'especialista'){ 
        this.turnos = this.turnos.filter(item => item.especialista.id === this.usuario.id);
        this.mostrarFiltroPaciente = true;
      } else { 
        this.mostrarFiltroEspecialista = true; 
      }

      
      this.cargarFiltros();
      // console.log("especialidad: ", this.filtroEspecialidad);
      // console.log("especialista: ", this.filtroEspecialista);
      // console.log("paciente: ", this.filtroPaciente);
    });
  }

  arreglarImagenes(url: string): string {
    return url.replace(/'/g, '"');
  }

  emitirDetalles(obj: any) {
    this.selectedObj = obj;
    this.mostrarDetalle = false;
    setTimeout(() => {
      this.mostrarDetalle = true;
    }, 0);
  }

  cargarFiltros() {
    this.auxTurnos = this.turnos;
    this.turnos.forEach(turno => {
      if (!this.filtroEspecialidad.some(e => e === turno.especialidad)) {
        this.filtroEspecialidad.push(turno.especialidad);
      }
      if (!this.filtroPaciente.some(p => p.id === turno.paciente.id)) {
        this.filtroPaciente.push(turno.paciente);
      }
      if (!this.filtroEspecialista.some(e => e.id === turno.especialista.id)) {
        this.filtroEspecialista.push(turno.especialista);
      }
      // console.log("especialidad: ", turno.especialidad);
      // console.log("especialista: ", turno.especialista.nombre + " " + turno.especialista.apellido + " - ID: "+ turno.especialista.id);
      // console.log("paciente: ", turno.paciente.nombre + " " + turno.paciente.apellido + " - ID: "+ turno.paciente.id);
    });
  }
  

  seleccionarEspecialidad(obj: string) {
    this.especialidadSeleccionada = obj;
    // this.turnos = this.auxTurnos;
    this.turnos = this.auxTurnos.filter(item => item.especialidad === obj);
    this.selectedObj = null;
    this.mostrarDetalle = false;
  }
  
  seleccionarEspecialista(obj: any) {
    this.especialistaSeleccionado = obj;
    // this.turnos = this.auxTurnos;
    this.turnos = this.auxTurnos.filter(item => item.especialista.id === obj.id);
    this.selectedObj = null;
    this.mostrarDetalle = false;
  }

  seleccionarPaciente(obj: any) {
    this.pacienteSeleccionado = obj;
    // this.turnos = this.auxTurnos;
    this.turnos = this.auxTurnos.filter(item => item.paciente.id === obj.id);
    this.selectedObj = null;
    this.mostrarDetalle = false;
  }

  refrescar(){
    this.turnos = this.auxTurnos;
    this.selectedObj = null;
    this.mostrarDetalle = false;
  }

  obtenerImagen(val: string) {
    switch (val) {
      case "Cardiologia": return 'https://github.com/dsvlivon/imagenes/blob/main/botones/cardiologia.jpg?raw=true';
        break;
      case "Cirujia de Coxis": return 'https://github.com/dsvlivon/imagenes/blob/main/botones/cirugia.jpg?raw=true';
        break;
      case "Medicina General": return 'https://github.com/dsvlivon/imagenes/blob/main/botones/general.jpg?raw=true';
        break;
      case "Ginecologia": return 'https://github.com/dsvlivon/imagenes/blob/main/botones/ginecologia.jpg?raw=true';
        break;
      case "Rayos Rimpi": return 'https://github.com/dsvlivon/imagenes/blob/main/botones/rayos.jpg?raw=true';
        break;
      case "Urologia": return 'https://github.com/dsvlivon/imagenes/blob/main/botones/urologia.jpg?raw=true';
        break;
      case "refrescar": return 'https://github.com/dsvlivon/imagenes/blob/main/botones/refresh.jpg?raw=true';
        break;
      default: return 'https://github.com/dsvlivon/imagenes/blob/main/botones/default.jpg';
        break;
    }
  }
}
