import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MisHorarios } from '../../models/misHorarios';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent implements OnInit{
  usuario: any;
  email: any = "";
  tipo: any = "";
  horarios: any[] = [];
  isEspecialista: boolean = true;
  horariosSeleccionados: string[] = [];
  misHorarios: any[] = [];
  id: string = "";

  constructor(
    private fireStore: FirebaseService,
    private router: Router
  ) {}

  
  ngOnInit(): void {
    this.getDatos();
  }

  getDatos() {
    this.email = localStorage.getItem('user');
    this.fireStore.obtenerDatoPorCriterio('usuarios', 'email', this.email).subscribe(data => {
      this.usuario = data[0];
      this.id = this.usuario.id;
      this.tipo = this.usuario.tipoUsuario;
      this.isEspecialista = (this.usuario.tipoUsuario === 'especialista');
      // console.log('Usuario:', this.usuario);
      // console.log("tipo usuario:", this.usuario.tipoUsuario);
   
      this.fireStore.obtenerDatoPorCriterio('misHorarios', 'especialista', this.id).subscribe(data => {
        this.misHorarios = data[0];
        console.log("misHorarios: ", this.misHorarios);
      });
    });  
    this.generarHorarios();
    this.marcarHorariosDisponibles();
  }

  goHome() { 
    this.router.navigate(['/home']);
  }


  generarHorarios() {
    const intervalosMinutos = 30;
    const horaInicio = 9;
    const horaFin = 18;

    for (let hora = horaInicio; hora < horaFin; hora++) {
      for (let minutos = 0; minutos < 60; minutos += intervalosMinutos) {
        const horaFormateada = hora < 10 ? `0${hora}` : `${hora}`;
        const minutosFormateados = minutos < 10 ? `0${minutos}` : `${minutos}`;
        let horario = `${horaFormateada}:${minutosFormateados}`;

        this.horarios.push(horario);
      }
    }
  }

  seleccionarHorario(horario: string) {
    const index = this.horariosSeleccionados.indexOf(horario);
    // console.log("horario selec.: ", horario)
    if (index === -1) {
      this.horariosSeleccionados.push(horario);
    } else {
      this.horariosSeleccionados.splice(index, 1);
    }
  }

  estaSeleccionado(horario: string): boolean {
    return this.horariosSeleccionados.includes(horario);
  }

  confirmar() {
    if (this.horariosSeleccionados.length === 0) {
      // console.log('Faltan datos para crear los horarios');
    } else {
      const obj: MisHorarios = {
        especialista: this.usuario.id,
        misHorarios: this.horariosSeleccionados
      };
      this.fireStore.setData(obj, 'misHorarios');   
      // console.log('Reserva de Horarios creada:', obj);      
    }
  }
  
  marcarHorariosDisponibles() {
    this.horarios.forEach(horario => {
      if (this.misHorarios.includes(horario)) {
        const button = document.getElementById(`horario-${horario.replace(':', '-')}`);
        if (button) {
          button.classList.add('disponible');
        }
      }
    });
  }
  
  cancelar(){}
}
