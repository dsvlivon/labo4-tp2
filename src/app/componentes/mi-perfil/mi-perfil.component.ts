import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MisHorarios } from '../../models/misHorarios';
import { CartelinComponent } from '../cartelin/cartelin.component';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, CartelinComponent],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent implements OnInit {
  usuario: any;
  email: any = "";
  tipo: any = "";
  horarios: any[] = [];
  isEspecialista: boolean = true;
  horariosSeleccionados: string[] = [];
  misHorarios: { [key: string]: any[] } = {};
  dias: string[] = ['Lunes', 'Martes','Miercoles','Jueves','Viernes','Sabado'];
  id: string = "";
  idHorarios = "";
  celdasElegidas: { [key: string]: string[] } = {};
  mostrarCartelin: boolean = false;
  isPaciente: boolean = true;
  @Output() historiaSeleccionada = new EventEmitter<string>();


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
      this.isPaciente = (this.usuario.tipoUsuario === 'paciente');
      
      this.fireStore.obtenerDatoPorCriterio('misHorarios', 'especialista', this.id).subscribe(data => {
        if (data && data.length > 0) {
          this.misHorarios = data[0].misHorarios || {};
          this.idHorarios = data[0].id || null;
          console.log("misHorarios lectura: ", this.idHorarios, this.misHorarios);
          this.inicializarCeldasElegidas();
        } else {
          console.log("No se encontraron horarios para el especialista.");
          this.misHorarios = {};
          this.idHorarios = "";
        }
      });
    });  
    this.generarHorarios();
  }

  inicializarCeldasElegidas() {
    this.celdasElegidas = { ...this.misHorarios };
  }

  goHome() { 
    this.router.navigate(['/home']);
  }

  isSelected(dia: string, time: string): boolean {
    return this.celdasElegidas[dia] && this.celdasElegidas[dia].includes(time);
  }

  generarHorarios() {
    const intervalosMinutos = 30;
    const horaInicio = 9;
    const horaFin = 17.5;

    for (let hora = horaInicio; hora < horaFin; hora++) {
      for (let minutos = 0; minutos < 60; minutos += intervalosMinutos) {
        const horaFormateada = hora < 10 ? `0${hora}` : `${hora}`;
        const minutosFormateados = minutos < 10 ? `0${minutos}` : `${minutos}`;
        const horario = `${horaFormateada}:${minutosFormateados}`;
        this.horarios.push(this.convertTo12HourFormat(horario));
      }
    }
  }

  mostrarMisHorarios(dia: string, horario: string): void {
    if (!this.celdasElegidas[dia]) {
      this.celdasElegidas[dia] = [];
    }
    const index = this.celdasElegidas[dia].indexOf(horario);
    if (index > -1) {
      this.celdasElegidas[dia].splice(index, 1);
    } else {
      this.celdasElegidas[dia].push(horario);
    }
    console.log('celdas:', this.celdasElegidas);
  }

  convertTo12HourFormat(time: string): string {
    const [hour, minute] = time.split(':').map(Number);
    const period = hour < 12 ? 'AM' : 'PM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
  }

  seleccionarHorario(horario: string) {
    const index = this.horariosSeleccionados.indexOf(horario);
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
    if (Object.keys(this.celdasElegidas).length === 0) {
      console.log('Faltan datos para crear los horarios');
    } else {
      const obj = {
        'especialista': this.usuario.id,
        'misHorarios': this.celdasElegidas
      };
      if(this.idHorarios != "") { 
        this.fireStore.actualizarHorarios('misHorarios', this.idHorarios, this.celdasElegidas); 
      } else { 
        this.fireStore.setData(obj, 'misHorarios'); 
      }
      
      console.log('Reserva de Horarios creada:', obj);
      this.showCartelin();      
    }
  }

  cancelar(){}

  showCartelin() {
    this.mostrarCartelin = true;
    setTimeout(() => {
      this.mostrarCartelin = false;
      this.router.navigateByUrl('/home', { replaceUrl: true });
    }, 2000);
  }

  historia(id:string){
    this.router.navigate(['/historiaClinica']);
    this.historiaSeleccionada.emit(id);
  }
}
