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
  displayedColumnasAdmins: string[] =       ['Estado Acceso', 'Tipo de Usuario', 'Foto', 'Nombre', 'Apellido', 'Dni', 'Edad', 'Email'];
  displayedColumnasEspecialista: string[] = ['Estado Acceso', 'Tipo de Usuario', 'Foto', 'Nombre', 'Apellido', 'Dni', 'Edad', 'Email', 'Especialidad'];
  displayedColumnasPacientes: string[] =    ['Estado Acceso', 'Tipo de Usuario', 'Foto', 'Nombre', 'Apellido', 'Dni', 'Edad', 'Email', 'Obra Social'];
  admins: any[] = [];
  pacientes: any[] = [];
  especialistas: any[] = [];
  selectedUsuario: Usuario | null = null;
  mostrarDetalle: boolean = false;

  mostrarEspecialistas: boolean = false;
  mostrarPacientes: boolean = false;
  mostrarAdmins: boolean = false;
  botonSeleccionado: string = '';

  @Output() historiaSeleccionada = new EventEmitter<string>();

  constructor(private fireStore: FirebaseService) { }

  ngOnInit(): void { this.getDatos(); }

  getDatos() {
    this.fireStore.obtenerDato('usuarios').subscribe(respuesta => {
      this.especialistas = respuesta.map(usuario => {
        if (usuario.imagen1) {
          usuario.imagen1 = this.arreglarImagenes(usuario.imagen1);
        }
        return usuario;
      }).filter(usuario => usuario.tipoUsuario === 'especialista');

      this.pacientes = respuesta.map(usuario => {
        if (usuario.imagen1) {
          usuario.imagen1 = this.arreglarImagenes(usuario.imagen1);
        }
        return usuario;
      }).filter(usuario => usuario.tipoUsuario === 'paciente');

      this.admins = respuesta.map(usuario => {
        if (usuario.imagen1) {
          usuario.imagen1 = this.arreglarImagenes(usuario.imagen1);
        }
        return usuario;
      }).filter(usuario => usuario.tipoUsuario === 'admin');
    });
  }

  arreglarImagenes(url: string): string {
    return url.replace(/'/g, '"');
  }

  emitirDetalles(obj: any) {
    this.selectedUsuario = obj;
    this.mostrarDetalle = true;
  }


  verPacientes(){
    this.mostrarPacientes = !this.mostrarPacientes;
    this.botonSeleccionado = 'pacientes';
  }
  verEspecialistas(){
    this.mostrarEspecialistas = !this.mostrarEspecialistas;
    this.botonSeleccionado = 'especialistas';
  }
  verAdmins(){
    this.mostrarAdmins = !this.mostrarAdmins;
    this.botonSeleccionado = 'admins';
  }

  seleccionarBoton(boton: string) {
    this.botonSeleccionado = boton;
    switch(boton) {
      case 'pacientes':
        this.verPacientes();
        break;
      case 'especialistas':
        this.verEspecialistas();
        break;
      case 'admins':
        this.verAdmins();
        break;
    }
  }

  emitirHistoriaSeleccionada(id: string) {
    this.historiaSeleccionada.emit(id);
  }
}
