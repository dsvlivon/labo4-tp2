import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { map, Observable } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const fireStore = inject(FirebaseService);
  const router = inject(Router);

  const email = localStorage.getItem('user');

  if (!email) {
    router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión si no hay un email en localStorage
    return false;
  }

  return fireStore.obtenerDatoPorCriterio('usuarios', 'email', email).pipe(
    map((users: any[]) => {
      const user = users[0];

      if (user && user.estadoAcceso === 'aprobado' && user.tipoUsuario === 'admin') {
        return true;
      } else {
        router.navigate(['/home']); // Redirige al usuario a la página de inicio si no es admin o no está aprobado
        return false;
      }
    })
  );
};
