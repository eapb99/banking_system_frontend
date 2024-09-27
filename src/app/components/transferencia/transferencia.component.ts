import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-transferencia',
  templateUrl: './transferencia.component.html',
  styleUrls: ['./transferencia.component.css']
})
export class TransferenciaComponent {
  cuentaOrigen: string = '';
  cuentaDestino: string= '' ;
  monto: number = 0;
  motivo: string = '';
  token: string='';
  mensaje: string = '';
  error: string = '';

  constructor(private authService: AuthService) { }

  realizarTransferencia(): void {
    this.authService.realizarTransferencia(this.cuentaOrigen, this.cuentaDestino, this.monto, this.motivo, this.token)
      .subscribe(
        (response) => {
          this.mensaje = response.mensaje;
          this.error = '';
          if (response.nuevo_token) {
            this.token = response.nuevo_token;
          }
        },
        (error) => {
          this.error = error.error.error;
          this.mensaje = '';
          if (error.error.nuevo_token) {
            this.token = error.error.nuevo_token;
          }
        }
      );
  }
}
