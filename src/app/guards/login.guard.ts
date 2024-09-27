import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    router.navigate(['/cuentas']);  // Usuario ya autenticado, redirigir al dashboard
    return false;
  } else {
    return true;  // Usuario no autenticado, puede acceder al login
  }
};
