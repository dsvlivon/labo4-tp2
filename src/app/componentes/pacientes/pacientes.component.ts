import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Usuario } from '../../models/usuarios.interface';
import { CommonModule } from '@angular/common';
import { Paciente } from '../../models/paciente.interface';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css'
})
export class PacientesComponent implements OnInit {
  turnos: any[] = [];
  email: any;
  usuario: any;
  pacientes: any[] = [];
  aux: any[] = [];
  @Output() historiaSeleccionada = new EventEmitter<string>();
  historiaClinica: any[] = [];

  constructor(private fireStore: FirebaseService) { }

  ngOnInit(): void {
    this.email = localStorage.getItem('user');
    this.fireStore.obtenerDatoPorCriterio('usuarios', 'email', this.email).subscribe(data => {
      this.usuario = data[0];
    })

    
    this.fireStore.obtenerDato('turnos').subscribe(respuesta => {
        this.turnos = respuesta;
        this.turnos = this.turnos.filter(item => item.especialista.id === this.usuario.id && item.estado === 'Realizado');
        console.log("turnos:", this.turnos);
      });

      this.fireStore.obtenerDato('usuarios').subscribe(data => {
        this.aux = data;
        
        this.turnos.forEach(turno => {
          this.aux.forEach(obj => {
            if(turno.paciente.id == obj.id){
              if(!this.pacientes.includes(obj)){
                this.pacientes.push(obj);              }  
            }
          })
        });
      });
  }

  obtenerUltimosTurnos(paciente: any): any[] {
    const turnosPaciente = this.turnos.filter(turno => turno.paciente.id === paciente.id);
    return turnosPaciente.sort((a, b) => new Date(b.dia).getTime() - new Date(a.dia).getTime()).slice(0, 3);
  }

  historia(id: string) {
    this.historiaSeleccionada.emit(id);
  }


}
