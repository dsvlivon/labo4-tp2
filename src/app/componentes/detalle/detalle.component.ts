import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnChanges {
  @Input() obj: any;
  mostrarDetalle: boolean = true;
  mostrarHabilitar: boolean = false;
  mostrarDeshabilitar: boolean = false;
  especialidades: string[] = [];

  constructor(private fireStore: FirebaseService) {
    // console.log("detalle!");
  }

  ngOnChanges() {
    if(this.obj.tipoUsuario == "especialista") {
      this.obtenerEspecialidades();
      
      if(this.obj.estadoAcceso == "pendiente") {
        this.mostrarHabilitar = true;
        this.mostrarDeshabilitar = false;
      } else {
        this.mostrarHabilitar = false;
        this.mostrarDeshabilitar = true;
      }      
    } else { 
      this.mostrarHabilitar = false;
      this.mostrarDeshabilitar = false;
    }
  }

  obtenerEspecialidades(){
    this.especialidades = [];
    console.log("obj esp: ", this.obj.especialidad)
    if (this.obj && Array.isArray(this.obj.especialidad)) {
        this.obj.especialidad.forEach((element: any) => {
            this.especialidades.push(element);
        });
    } else {
        console.error("especialistaSeleccionado no tiene una propiedad especialidad válida");
    }
  }

  cerrarModal() {
    this.mostrarDetalle = false;
  }

  habilitar() {
    // alert("asdasd");
    if (this.obj && this.obj.id) {
      this.fireStore.actualizarObj('usuarios', this.obj.id, 'aprobado');
      console.log("Usuario habilitado!");
      this.cerrarModal();
    }
  }

  Deshabilitar() {
    if (this.obj && this.obj.id) {
      this.fireStore.actualizarObj('usuarios', this.obj.id, 'pendiente');
      console.log("Usuario deshabilitado!");
      this.cerrarModal();
    }
  }
}
