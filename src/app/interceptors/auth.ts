import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      // Clonar la solicitud y agregar el token de acceso al encabezado Authorization
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });

      // Enviar la solicitud con el token JWT
      return next.handle(clonedReq).pipe(
        catchError((error: HttpErrorResponse) => {
          // Si la solicitud retorna un 401 (Unauthorized), refrescar el token
          if (error.status === 401 && this.authService.getRefreshToken()) {
            // Intentar refrescar el token
            return this.authService.refreshToken().pipe(
              switchMap((response: any) => {
                // Guardar el nuevo token
                this.authService.saveToken(response.access);

                // Clonar la solicitud original con el nuevo token
                const newReq = req.clone({
                  headers: req.headers.set('Authorization', `Bearer ${response.access}`)
                });

                // Reintentar la solicitud original con el nuevo token
                return next.handle(newReq);
              }),
              catchError((refreshError) => {
                // Si el refresh falla, cerrar sesión
                this.authService.logout();
                return throwError(refreshError);
              })
            );
          }

          return throwError(error);
        })
      );
    }

    // Si no hay token, continuar la solicitud sin modificarla
    return next.handle(req);
  }
}
