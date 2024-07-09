import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CloudStorageService } from '../../services/cloud-storage.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Turnos } from '../../models/turnos.interface';
import { MatIconModule } from '@angular/material/icon';
import { CartelinComponent } from '../cartelin/cartelin.component';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, FormsModule, MatCheckboxModule, MatButtonToggleModule, SpinnerComponent, CartelinComponent],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css'
})
export class TurnosComponent implements OnInit {
  diaSeleccionado: any;
  horarioSeleccionado: any;
  especialistaSeleccionado: any;
  especialidadSeleccionada: any;
  pacienteSeleccionado: any;

  mostrarEspecialidad: boolean = false;
  mostrarEspecialista: boolean = false;
  mostrarDia: boolean = false;
  mostrarHorario: boolean = false;
  mostrarCartelin: boolean = false;

  fechaHoy: string = "";
  diaHoy: string = "";
  mesHoy: string = "";
  horarios: string[] = [];
  horariosDisponibles: string[] = [];

  listaEspecialidades: any[] = [];
  auxListaEspecialidades: any[] = [];
  listaEspecialistas: any[] = [];
  auxListaEspecialistas: any[] = [];
  fechasQuincena: { fecha: string, dia: string }[] = [];
  especialidades: string[] = [];
  especialistas: any[] = [];
  turnos: any[] = [];
  pacientes: any[] = [];

  dias: string[] = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  email: any = "";
  usuario: any;
  esAdmin: boolean = false;
  tipoUsuario: string = "";

  idHorarios = "";
  misHorarios: { [key: string]: any[] } = {};

  constructor(
    private fireStore: FirebaseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getDatos();
  }

  getDatos() {
    this.fechaHoy = this.obtenerFechaHoy();
    this.diaHoy = this.obtenerDiaSemana(new Date());
    // console.log("Hoy: ", this.diaHoy + " - " + this.fechaHoy);

    this.email = localStorage.getItem('user');
    this.fireStore.obtenerDatoPorCriterio('usuarios', 'email', this.email).subscribe(data => {
      this.usuario = data[0];
      this.tipoUsuario = this.usuario.tipoUsuario;
      console.log('Usuario:', this.usuario);
    });

    this.fireStore.obtenerDato('usuarios').subscribe(respuesta => {
      this.pacientes = respuesta.filter(usuario => usuario.tipoUsuario === 'paciente');
      this.listaEspecialistas = respuesta.filter(usuario => usuario.tipoUsuario === 'especialista' && usuario.estadoAcceso === 'aprobado');
      this.auxListaEspecialistas = this.listaEspecialistas;
      // console.log("especialistas: ", this.listaEspecialistas);
    });
  }

  convertirAMPM(horario: string): string {
    let [hora, minutos] = horario.split(':').map(Number);
    const periodo = hora >= 12 ? 'PM' : 'AM';
    hora = hora % 12 || 12; // Convertir 0 o 12 a 12 para AM/PM
    const horaFormateada = hora < 10 ? `0${hora}` : `${hora}`;
    return `${horaFormateada}:${minutos < 10 ? `0${minutos}` : minutos} ${periodo}`;
  }

  generarEspecialidades() {
    this.listaEspecialidades = []; // Reset listaEspecialidades
    if (this.especialistaSeleccionado && Array.isArray(this.especialistaSeleccionado.especialidad)) {
      this.especialistaSeleccionado.especialidad.forEach((element: any) => {
        this.listaEspecialidades.push(element);
      });
    } else {
      console.error("especialistaSeleccionado no tiene una propiedad especialidad válida");
    }
    // console.log("Especialidades disponibles:", this.listaEspecialidades);
  }

  obtenerImagen(val: string) {
    switch (val) {
      case "Cardiologia": return 'https://github.com/dsvlivon/imagenes/blob/main/botones/cardiologia.jpg?raw=true';
        break;
      case "Cirugia de Coxis": return 'https://github.com/dsvlivon/imagenes/blob/main/botones/cirugia.jpg?raw=true';
        break;
      case "Medicina General": return 'https://github.com/dsvlivon/imagenes/blob/main/botones/general.jpg?raw=true';
        break;
      case "Ginecologia": return 'https://github.com/dsvlivon/imagenes/blob/main/botones/ginecologia.jpg?raw=true';
        break;
      case "Rayos Rimpi": return 'https://github.com/dsvlivon/imagenes/blob/main/botones/rayos.jpg?raw=true';
        break;
      case "Urologia": return 'https://github.com/dsvlivon/imagenes/blob/main/botones/urologia.jpg?raw=true';
        break;
      default: return 'https://github.com/dsvlivon/imagenes/blob/main/botones/default.jpg';
        break;
    }
  }

  obtenerFechaHoy(): string {
    const hoy = new Date();
    return formatDate(hoy, 'dd/MM/yyyy', 'en-AR');
  }

  obtenerDiaSemana(fecha: Date): string {
    return this.dias[fecha.getDay()];
  }

  seleccionarEspecialidad(especialidad: string) {
    this.especialidadSeleccionada = especialidad;

    if (this.especialidadSeleccionada) {
      // this.refrescar(); 
      this.mostrarEspecialidad = true;
      this.mostrarDia = true;
    } else {
      this.mostrarEspecialidad = false;
      this.mostrarDia = false;
    }
    if (this.especialidadSeleccionada === "Todos") {
      this.refrescar();
    }
  }

  seleccionarEspecialista(obj: any) {
    if (this.especialistaSeleccionado != obj && this.especialistaSeleccionado != null) {
      this.listaEspecialidades = this.auxListaEspecialidades;
    }

    this.especialistaSeleccionado = obj;
    console.log("Especialista seleccionada:", this.especialistaSeleccionado.nombre + " " + this.especialistaSeleccionado.apellido);
    this.auxListaEspecialidades = this.listaEspecialidades;
    this.listaEspecialidades = this.listaEspecialidades.filter(obj => obj.especialidad === this.especialistaSeleccionado.especialidad);
    this.mostrarEspecialista = true;
    this.mostrarEspecialidad = true;

    // console.log("especialista: ", this.especialistaSeleccionado);
    this.generarEspecialidades();
    // this.obtenerHorarios();
    this.obtenerdiasFiltrados();
  }

  obtenerdiasFiltrados() {
    this.fireStore.obtenerDatoPorCriterio('misHorarios', 'especialista', this.especialistaSeleccionado.id).subscribe(data => {
      if (data && data.length > 0) {
        this.misHorarios = data[0].misHorarios || {};
        this.idHorarios = data[0].id || null;
        console.log("misHorarios :", this.misHorarios);
      }
      setTimeout(() => {
        this.fireStore.obtenerDatoPorCriterio('turnos', 'especialista.id', this.especialistaSeleccionado.id).subscribe(data => {
          if (data && data.length > 0) {
            this.turnos = data || {};
            console.log("turnos :", this.turnos);
          } else {
            console.log("No se encontraron turnos para el especialista:", this.especialistaSeleccionado.id);
          }
        // this.fechasQuincena.filter{}
        
        
        this.calcularQuincena();
        this.generarHorarios();
      })  }, 1000);      
    });
  }

  generarHorarios() {
    const intervalosMinutos = 30;
    const horaInicio = 9;
    const horaFin = 18;
  
    this.horarios = [];
  
    // Genera los horarios disponibles
    for (let hora = horaInicio; hora < horaFin; hora++) {
      for (let minutos = 0; minutos < 60; minutos += intervalosMinutos) {
        const horaFormateada = hora < 10 ? `${hora}` : `${hora}`;
        const minutosFormateados = minutos === 0 ? '00' : `${minutos}`;
        const horaCompleta = `${horaFormateada}:${minutosFormateados}`;
  
        const horario12h = this.formatoHora12(hora, minutos); // Formato 12 horas
  
        // Verifica si el horario está disponible en misHorarios
        if(this.misHorarios){
          if (this.horarioDisponibleEnMisHorarios(horario12h)) {
            this.horarios.push(horario12h);
          } 
        } else {this.horarios.push(horario12h);}
      }
    }
  }
  
  formatoHora12(hora: number, minutos: number): string {
    const ampm = hora < 12 ? 'AM' : 'PM';
    const hora12 = hora % 12 || 12; // Convierte la hora a formato 12 horas
    const horaFormateada = hora12 < 10 ? `${hora12}` : `${hora12}`;
    const minutosFormateados = minutos === 0 ? '00' : `${minutos}`;
    return `${horaFormateada}:${minutosFormateados} ${ampm}`;
  }
  
  horarioDisponibleEnMisHorarios(horario: string): boolean {
    for (const dia in this.misHorarios) {
      if (this.misHorarios.hasOwnProperty(dia)) {
        const horariosDia = this.misHorarios[dia];
        for (const hora of horariosDia) {
          console.log("const hora: ", hora);
          if (hora === horario) {
            return true;
          }
        }
      }
    }
    return false;
  } 

  calcularQuincena() {
    const hoy = new Date();
    let diasValidosGenerados = 0;
    let diasTotales = 0;
    this.fechasQuincena = [];
  
    while (diasValidosGenerados < 15) {
      const nuevaFecha = new Date(hoy);
      nuevaFecha.setDate(hoy.getDate() + diasTotales);
      const fechaFormateada = formatDate(nuevaFecha, 'dd-MM-YYYY', 'en-AR');
      this.mesHoy = formatDate(nuevaFecha, 'MM', 'en-AR');
      const diaSemana = this.obtenerDiaSemana(nuevaFecha);
  
      if (this.misHorarios[diaSemana]) {
        this.fechasQuincena.push({ fecha: fechaFormateada, dia: diaSemana });
        diasValidosGenerados++;
      }
      diasTotales++; // Avanza al siguiente día en cualquier caso
    }
  }

  estaSeleccionado(obj: any): boolean {
    // Lógica para verificar si el especialista está seleccionado
    return this.especialistaSeleccionado === obj;
  }

  refrescar() {
    this.listaEspecialidades = this.auxListaEspecialidades;
    this.listaEspecialistas = this.auxListaEspecialistas;
    this.mostrarEspecialidad = false;
    this.mostrarDia = false;
    this.mostrarHorario = false;
  }

  confirmarTurno() {
    if (this.especialidadSeleccionada && this.especialistaSeleccionado && this.diaSeleccionado && this.horarioSeleccionado) {
      var paciente: any;
      if(this.esAdmin){ paciente = this.pacienteSeleccionado; } 
      else { paciente = this.usuario; }

      const obj: Turnos = {
        especialidad: this.especialidadSeleccionada,
        especialista: this.especialistaSeleccionado,
        dia: `${this.diaSeleccionado.dia} ${this.diaSeleccionado.fecha}`,
        hora: this.horarioSeleccionado,
        estado: 'Pendiente', // por default
        paciente: paciente
      };
      
      this.fireStore.setData(obj, 'turnos');
      console.log('Nuevo turno creado:', obj);
      this.showCartelin();
    } else {
      console.log('Faltan datos para crear el turno');
    }
  }

  cancelarTurno() {
    this.especialistaSeleccionado = null;
    this.especialidadSeleccionada = null;
    this.diaSeleccionado = null;
    this.horarioSeleccionado = null;

    this.mostrarEspecialista = false;
    this.mostrarEspecialidad = false;
    this.mostrarDia = false;
    this.mostrarHorario = false;
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  showCartelin() {
    this.mostrarCartelin = true;
    setTimeout(() => {
      this.mostrarCartelin = false;
    }, 2000);
  }

  seleccionarHorario(val: any) {
    // console.log("Opción seleccionada:", this.horarioSeleccionado);
    this.horarioSeleccionado = val
    if (this.horarioSeleccionado) {
      this.mostrarHorario = true;
    } else {
      this.mostrarHorario = false;
    }

    if(this.tipoUsuario == "admin") { this.esAdmin = true; }
  }

  seleccionarDia(val: any) {
    this.diaSeleccionado = val;
    console.log("Día seleccionado: ", this.diaSeleccionado);
    this.descontarTurnosTomados();

    if (this.diaSeleccionado) {
      this.mostrarDia = true;
    } else {
      this.mostrarDia = false;
    }
    this.mostrarHorario = true;
  }

  descontarTurnosTomados() {
    if (this.diaSeleccionado) {
      const turnoFecha = `${this.diaSeleccionado.dia} ${this.diaSeleccionado.fecha}`;
  
      // Iterar sobre los turnos y filtrar el horario correspondiente
      this.turnos.forEach(turno => {
        if (turno.dia === turnoFecha) {
          this.horarios = this.horarios.filter(horario => horario !== turno.hora);
        }
      });
    }
  }

  seleccionarPaciente() {
    console.log('Paciente seleccionado:', this.pacienteSeleccionado);
  }
}