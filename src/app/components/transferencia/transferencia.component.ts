import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-transferencia',
  templateUrl: './transferencia.component.html',
  styleUrls: ['./transferencia.component.css']
})
export class TransferenciaComponent implements OnInit{
  cuentasOrigen: any[] = [];
  cuentaOrigenSeleccionada: any = null;  // Cuenta de origen seleccionada
  cuentaDestino: string= '' ;
  monto: number = 0;
  motivo: string = '';
  tokenSeguridad: string='';
  tiempoRestante: number = 60;
  mensaje: string = '';
  error: string = '';
  contactos: any[] = [];
  tokenInterval: any;  

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.obtenerCuentaOrigen().subscribe(
      (response) => {
        this.cuentasOrigen = response.cuentas;
        if (this.cuentasOrigen.length > 0) {
          this.cuentaOrigenSeleccionada = this.cuentasOrigen[0];
          this.obtenerContactos();  
          this.generarToken();  
        }
      },
      (error) => {
        console.error('Error al obtener cuenta de origen:', error);
      }
    );  }

    obtenerContactos(): void {
      if (this.cuentaOrigenSeleccionada) {
        this.authService.obtenerContactos().subscribe(
          (response) => {
            this.contactos = response.contactos;
          },
          (error) => {
            console.error('Error al obtener contactos:', error);
          }
        );
      }
    }

    generarToken(): void {
      this.authService.generarTokenSeguridad().subscribe(
        (response) => {
          this.tokenSeguridad = response.token;
          this.tiempoRestante = response.tiempo_restante;
          this.resetCronometro();
        },
        (error) => {
          console.error('Error al generar el token de seguridad:', error);
        }
      );
    }
    resetCronometro(): void {
      if (this.tokenInterval) {
        clearInterval(this.tokenInterval);
      }
  
      this.tokenInterval = setInterval(() => {
        this.tiempoRestante--;
        if (this.tiempoRestante <= 0) {
          clearInterval(this.tokenInterval);
          this.generarToken();  // Generar un nuevo token automáticamente
        }
      }, 1000);
    }

  realizarTransferencia(): void {
    if (!this.cuentaOrigenSeleccionada || !this.monto || !this.tokenSeguridad) {
      this.error = 'Por favor, completa todos los campos.';
      return;
    }
    this.authService.realizarTransferencia(this.cuentaOrigenSeleccionada.numero, this.cuentaDestino, this.monto, this.motivo, this.tokenSeguridad)
      .subscribe(
        (response) => {
          this.mensaje = response.mensaje;
          this.error = '';
          if (response.nuevo_token) {
            this.tokenSeguridad = response.nuevo_token;
          }
          alert('Transferencia realizada con éxito');
          this.router.navigate(['/tokens']);
        },
        (error) => {
          this.error = error.error.error;
          this.mensaje = '';
          if (error.error.nuevo_token) {
            this.tokenSeguridad = error.error.nuevo_token;
          }
        }
      );
  }


  cancelar() {
    this.router.navigate(['/tokens']);
  }
}
