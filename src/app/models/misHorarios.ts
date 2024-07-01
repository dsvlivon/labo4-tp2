import { Usuario } from "./usuarios.interface";

export interface MisHorarios {
    id:string;
    especialista: string;
    misHorarios: { [key: string]: string[] };
}