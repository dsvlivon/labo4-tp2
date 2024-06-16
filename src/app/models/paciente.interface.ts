import { Usuario } from "./usuarios.interface";

export interface Paciente extends Usuario {
    obraSocial: string;
}
//nombre: string;       / / / / / / / /
//apellido: string;     / / / / / / / /
//edad: number;         / / / / / / / /
//dni: number;          / / / / / / / /
//email?: string;       / / / / / / / /
//password?: string;    / / / / / - / /
//imagen1?: string[];   / / / / / / / /
//imagen2?: string[];   - - / / / - - /
//tipoUsuario: string;  / / / / / / / /