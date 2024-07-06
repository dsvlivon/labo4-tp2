import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TiempoService {
  dias: any;
  mesHoy: string | undefined;
  fechasQuincena: any;

  constructor() { }

  obtenerFechaHoy(): string {
    const hoy = new Date();
    return formatDate(hoy, 'dd/MM/yyyy', 'en-AR');
  }

  obtenerDiaSemana(fecha: Date): string {
    // return this.dias[fecha.getDay()];
    return "";
  }

  convertirAMPM(horario: string): string {
    let [hora, minutos] = horario.split(':').map(Number);
    const periodo = hora >= 12 ? 'PM' : 'AM';
    hora = hora % 12 || 12; // Convertir 0 o 12 a 12 para AM/PM
    const horaFormateada = hora < 10 ? `0${hora}` : `${hora}`;
    return `${horaFormateada}:${minutos < 10 ? `0${minutos}` : minutos} ${periodo}`;
  }

  calcularQuincena() {
    const hoy = new Date();
    for (let i = 0; i < 15; i++) {
      const nuevaFecha = new Date(hoy);
      nuevaFecha.setDate(hoy.getDate() + i);
      const fechaFormateada = formatDate(nuevaFecha, 'dd-MM-YYYY', 'en-AR');
      this.mesHoy = formatDate(nuevaFecha, 'MM', 'en-AR');
      const diaSemana = this.obtenerDiaSemana(nuevaFecha);
      this.fechasQuincena.push({ fecha: fechaFormateada, dia: diaSemana });
    }
  }
}
