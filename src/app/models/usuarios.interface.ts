export interface Usuario {
    nombre: string;
    apellido: string;
    edad: number;
    dni: number;
    email?: string;
    password?: string;
    imagen1?: string[];
    imagen2?: string[];
    tipoUsuario: string; 
    estadoAcceso: string;
  }