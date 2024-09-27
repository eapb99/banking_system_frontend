import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.css']
})
export class CuentasComponent implements OnInit {
  cuentaOrigen: any[] = []; 
  constructor(private authService: AuthService, private router:Router) { }

  ngOnInit(): void {
    this.authService.obtenerCuentaOrigen().subscribe(
      (response) => {
        this.cuentaOrigen = response.cuentas;
      },
      (error) => {
        console.error('Error al obtener cuenta de origen:', error);
      }
    );
  }

  realizarTransferencia(): void {
    this.router.navigate(['/transferencia']);
  }

  verTokens(): void {
    this.router.navigate(['/tokens']);
  }
}
