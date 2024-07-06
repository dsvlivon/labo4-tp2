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
  
  fechaHoy: string = "";
  diaHoy: string = "";
  mesHoy: string = "";
  horarios: string[] = [];
  email: any;
  turnos: any[] = [];

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
      console.log('Usuario:', this.usuario);
    });  

    this.fireStore.obtenerDato('turnos').subscribe(respuesta => {
      this.turnos = respuesta;
      console.log("turnos: ", this.turnos);
    });
  }
  
  arreglarImagenes(url: string): string {
    return url.replace(/'/g, '"');
  }
  
  emitirDetalles(obj: any) {
    this.selectedObj = obj;
    this.mostrarDetalle = true;
  }
}
