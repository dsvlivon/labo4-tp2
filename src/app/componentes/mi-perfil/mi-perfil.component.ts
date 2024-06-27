import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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
      console.log('Usuario:', this.usuario);
      this.tipo = this.usuario.tipoUsuario;
    });  
  }

  goHome() { 
    this.router.navigate(['/home']);
  }
}
