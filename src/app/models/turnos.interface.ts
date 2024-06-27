import { Usuario } from "./usuarios.interface";

export interface Turnos {
    especialidad: string;
    especialista: Usuario;
    dia: string,
    hora: string;
    estado: string;
    paciente: Usuario;
}