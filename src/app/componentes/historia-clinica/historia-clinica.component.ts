import { Component, Input, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-historia-clinica',
  standalone: true,
  imports: [MatGridListModule, MatIconModule, MatGridListModule, CommonModule, MatTableModule],
  templateUrl: './historia-clinica.component.html',
  styleUrl: './historia-clinica.component.css'
})
export class HistoriaClinicaComponent implements OnInit {
  @Input() pacienteId: any;
  email: any;
  paciente: any;
  historiaClinica: any;
  historias: any[] = [];
  atenciones: any[] = [];
  tipoUsuario: any;
  mostrarClave2:boolean = false;
  mostrarClave3:boolean = false;

  constructor( private fireStore: FirebaseService ) {}

  ngOnInit(): void {
    console.log("id :", this.pacienteId);
    this.fireStore.obtenerDatoPorCriterio('historiaClinica', 'id', this.pacienteId).subscribe(data => {
      this.historiaClinica = data[0];
      if(this.historiaClinica.clave2 != "" && this.historiaClinica.value2 != "" ){ this.mostrarClave2 = true;}
      if(this.historiaClinica.clave3 != "" && this.historiaClinica.value3 != "" ){ this.mostrarClave3 = true;}
      this.paciente = this.historiaClinica.paciente;
      
      this.historiaClinica.atenciones.forEach((element: any) => {
        this.atenciones.push(element);
      });
      // console.log('x Usuario:', this.paciente);
      // console.log("x historia: ", this.historiaClinica);
      // console.log("x atenciones: ", this.atenciones);
    });
    
  }
  
  verificarHistoria(): boolean {
    if(!this.historiaClinica) {return false; }
    return this.historiaClinica.atenciones.some((element: { id: any }) => {
      return element.id === this.paciente.id;
    });
  }

  cerrarModal(){}
}



