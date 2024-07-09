import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { CommonModule } from '@angular/common';
import { CartelinComponent } from '../cartelin/cartelin.component';

@Component({
  selector: 'app-mi-perfil2',
  standalone: true,
  imports: [CommonModule, CartelinComponent],
  templateUrl: './mi-perfil2.component.html',
  styleUrls: ['./mi-perfil2.component.css']
})
export class MiPerfil2Component implements OnInit {
  usuario: any;
  email: any = "";
  id: string = "";
  isPaciente: boolean = true;
  @Output() historiaSeleccionada2 = new EventEmitter<string>();

  constructor(private fireStore: FirebaseService) {}

  ngOnInit(): void {
    this.getDatos();
  }

  getDatos() {
    this.email = localStorage.getItem('user');
    this.fireStore.obtenerDatoPorCriterio('usuarios', 'email', this.email).subscribe(data => {
      this.usuario = data[0];
      this.id = this.usuario.id;
      this.isPaciente = (this.usuario.tipoUsuario === 'paciente');      
    });
  }

  historia(id: string) {
    this.historiaSeleccionada2.emit(id);
  }
}
