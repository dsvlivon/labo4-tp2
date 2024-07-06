import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  mostrarHabilitar: boolean = false;
  mostrarComentario: boolean = false;
  mostrarCancelar: boolean = false;
  mostrarCompletar: boolean = false;
  mostrarRealizar: boolean = false;
  mostrarRealizar2: boolean = false;
  especialidades: string[] = [];
  email: any;
  usuario: any;
  comentario: any;
  resena: any;
  
  mostrarResena: boolean = false;
  mostrarEncuesta: boolean = false;
  mostrarCalificar: boolean = false;

  constructor(private fireStore: FirebaseService) {
    // console.log("detalle!");
  }

  ngOnInit(): void {
    if(this.obj.comentario != null){ 
      this.mostrarResena = true; }
    if(this.obj.reseña) { 
      this.mostrarEncuesta = true; 
    }
    if(this.obj.estado == 'Realizado' ){ 
      this.mostrarEncuesta = true; 
      this.mostrarCalificar = true;
    }

    this.email = localStorage.getItem('user');
    this.fireStore.obtenerDatoPorCriterio('usuarios', 'email', this.email).subscribe(data => {
      this.usuario = data[0];
      // console.log('Usuario:', this.usuario);
      
      if(this.usuario.tipoUsuario == "paciente") {
        if(this.obj.estado == "Pendiente") {
          this.mostrarCancelar = true;
        }
      }
      if(this.usuario.tipoUsuario == "especialista") {
        if(this.obj.estado == "Pendiente") {
          this.mostrarHabilitar = true;
          this.mostrarCompletar = false;
        }
        if(this.obj.estado == "Aprobado") {
          this.mostrarHabilitar = false;
          this.mostrarCompletar = true;
        }
      }
    });
  }

  ngOnChanges() {
    if(this.usuario == "paciente") {
      this.mostrarCancelar = true;
    }
    if(this.obj.tipoUsuario == "especialista") {
      if(this.obj.estadoAcceso == "pendiente") {
        this.mostrarHabilitar = true;
        this.mostrarCompletar = false;
      } else {
        this.mostrarCompletar = false;
        this.mostrarCompletar = true;
      }
    }
  }

  cerrarModal() {
    this.mostrarDetalle = false;
  }

  Mostrar() {
    this.mostrarComentario = !this.mostrarComentario;
  }

  InteractuarTurno(accion: string) {
    if (this.obj && this.obj.id) {
      if (accion === "Cancelado" && this.comentario) {
          this.fireStore.actualizarTurnos('turnos', this.obj.id, accion, this.comentario);
      } else {
          this.fireStore.actualizarTurnos('turnos ', this.obj.id, accion);
      }

      if (accion === "Aprobado") {
        this.fireStore.actualizarTurnos('turnos', this.obj.id, accion);
      }
      if (accion === "Realizado") {
        this.fireStore.actualizarTurnos('turnos', this.obj.id, accion);
      }



      // console.log("Usuario habilitado!");
      this.cerrarModal();
    }
  }

}
