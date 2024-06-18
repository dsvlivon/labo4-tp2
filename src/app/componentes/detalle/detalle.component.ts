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

  constructor(private fireStore: FirebaseService) {
    console.log("detalle!");
  }

  ngOnChanges() {
    this.mostrarDetalle = !!this.obj;
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
}
