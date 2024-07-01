import { Especialidad } from "./especialidad.interface";
import { Usuario } from "./usuarios.interface";

export interface Especialista extends Usuario {
    especialidad: string[];
}