import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/api';  // URL del backend Django

  constructor(private http: HttpClient) { }

  // Método para hacer login y almacenar el JWT
  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post(`${this.apiUrl}/token/`, body);
  }

  // Método para guardar el token en localStorage
  saveToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  // Método para obtener el token del localStorage
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  saveRefreshToken(refreshToken: string): void {
    localStorage.setItem('refresh_token', refreshToken);
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.http.post(`${this.apiUrl}/token/refresh/`, { refresh: refreshToken });
  }

  // Método para decodificar el JWT y obtener el payload (user_id, username, etc.)
  listarTokens(): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtener_tokens_cliente/`);
  }

  obtenerCuentaOrigen(): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtener_cuenta_origen/`);
  }

  decodeToken(token: string): any {
    if (!token) {
      return null;
    }
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    let json= JSON.parse(decodedPayload);
    return json

  }

  // Método para obtener el user_id o username decodificado desde el token
  getUserInfoFromToken(): any {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      return decoded;  // Devuelve todo el payload (username, user_id, etc.)
    }
    return null;
  }

  // Método para cerrar sesión y borrar el token
  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('refresh_token');
  }


  realizarTransferencia(cuenta_origen: string, cuenta_destino: string, monto: number, motivo: string, token: string): Observable<any> {
    const body = {
      cuenta_origen,
      cuenta_destino,
      monto,
      motivo,
      token
    };
    return this.http.post(`${this.apiUrl}/transferencia/`, body);
  }
}
