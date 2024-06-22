import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../models/usuarios.interface';
import { FirebaseService } from '../../services/firebase.service';
import { DetalleComponent } from '../detalle/detalle.component';
import { EstadoAccesoDirective } from '../../directivas/estado-acceso.directive';


@Component({
  selector: 'app-habilitar-usuarios',
  standalone: true,
  imports: [MatGridListModule, MatIconModule, MatGridListModule, CommonModule, MatTableModule, DetalleComponent, EstadoAccesoDirective],
  templateUrl: './habilitar-usuarios.component.html',
  styleUrls: ['./habilitar-usuarios.component.css']
})
export class HabilitarUsuariosComponent implements OnInit {
  @Output() peliculaSeleccionada = new EventEmitter<any>();
  displayedColumnasPacientes: string[] = [ 'Estado Acceso', 'Tipo de Usuario', 'Foto', 'Nombre', 'Apellido', 'Dni', 'Edad', 'Email', 'Obra Social'];
  displayedColumnasEspecialista: string[] = [ 'Estado Acceso', 'Tipo de Usuario', 'Foto', 'Nombre', 'Apellido', 'Dni', 'Edad', 'Email', 'Especialidad'];
  lista: Usuario[] = [];
  lista2: Usuario[] = [];
  dataSource: Usuario[] = [];
  selectedUsuario: Usuario | null = null;
  mostrarDetalle: boolean = false;

  constructor(private fireStore: FirebaseService) {}

  ngOnInit(): void { this.getDatos(); }

  getDatos() {
    this.fireStore.obtenerDato('usuarios').subscribe(respuesta => {
      this.lista = respuesta
        .map(usuario => {
          if (usuario.imagen1) {
            usuario.imagen1 = this.arreglarImagenes(usuario.imagen1);
          }
          return usuario;
          }).filter(usuario => usuario.tipoUsuario === 'especialista' || usuario.tipoUsuario === 'admin');
      //aplicar Criterios de filtros -> logica de codigo (la otra opcion es pasar criterios a la query p usar el motor del sql d fb)
      this.dataSource = this.lista;

      this.lista2 = respuesta
      .map(usuario => {
        if (usuario.imagen1) {
          usuario.imagen1 = this.arreglarImagenes(usuario.imagen1);
        }
        return usuario;
        }).filter(usuario => usuario.tipoUsuario === 'paciente');
      // this.dataSource2 = this.lista;
    });
  }
  
  arreglarImagenes(url: string): string {
    return url.replace(/'/g, '"');
  }
  
  emitirDetalles(obj: any) {
    this.selectedUsuario = obj;
    this.mostrarDetalle = true;
  }
}
