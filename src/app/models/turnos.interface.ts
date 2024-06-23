import { Usuario } from "./usuarios.interface";

export interface Turnos {
    especialidad: string;
    especialista: Usuario;
    diaYHora: string;
    estado: string;
}