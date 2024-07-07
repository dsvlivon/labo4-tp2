import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'saludo',
  standalone: true
})
export class SaludoPipe implements PipeTransform {

  transform(usuario: any): string {
    if (usuario.tipoUsuario === 'especialista') {
      return `Bienvenido Dr. ${usuario.nombre} ${usuario.apellido}`;
    } if (usuario.tipoUsuario === 'admin') {
      return `Acceso Admin: ${usuario.nombre} ${usuario.apellido}`;
    }else {
      return `Hola ${usuario.nombre} ${usuario.apellido}`;
    }
  }

}
