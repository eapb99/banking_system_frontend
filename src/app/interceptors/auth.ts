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

      return next.handle(clonedReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 && this.authService.getRefreshToken()) {
            return this.authService.refreshToken().pipe(
              switchMap((response: any) => {
                this.authService.saveToken(response.access);
                const newReq = req.clone({
                  headers: req.headers.set('Authorization', `Bearer ${response.access}`)
                });
                return next.handle(newReq);
              }),
              catchError((refreshError) => {
                this.authService.logout();
                return throwError(refreshError);
              })
            );
          }

          return throwError(error);
        })
      );
    }
    return next.handle(req);
  }
}
