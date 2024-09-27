import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;  // Usuario autenticado, puede acceder a la ruta
  } else {
    router.navigate(['/login']);  // Usuario no autenticado, redirigir al login
    return false;
  }
};
