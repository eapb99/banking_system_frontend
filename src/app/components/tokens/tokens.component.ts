import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.css']
})
export class TokensComponent implements OnInit {

  tokens: any[] = [];  // Lista de tokens obtenidos del backend
  filteredTokens: any[] = [];  // Lista de tokens filtrados
  filter: string = 'all';  // Filtro por defecto (todos los tokens)
  cuentaOrigen: any[] = [];  // Información de la cuenta de origen

  constructor(private authService: AuthService, private router:Router) { }

  ngOnInit(): void {
    this.authService.obtenerCuentaOrigen().subscribe(
      (response) => {
        this.cuentaOrigen = response.cuentas;
        console.log('Cuenta de origen:', this.cuentaOrigen);
      },
      (error) => {
        console.error('Error al obtener cuenta de origen:', error);
      }
    );
    // Llamar al servicio para obtener los tokens
    this.authService.listarTokens().subscribe(
      (response) => {
        this.tokens = response.tokens;
        this.applyFilter();  // Aplicar filtro al inicio
      },
      (error) => {
        console.error('Error al obtener tokens:', error);
      }
    );
  }

  // Método para aplicar el filtro (todos, válidos, inválidos)
  applyFilter(): void {
    if (this.filter === 'valid') {
      this.filteredTokens = this.tokens.filter(token => token.es_valido);
    } else if (this.filter === 'invalid') {
      this.filteredTokens = this.tokens.filter(token => !token.es_valido);
    } else {
      this.filteredTokens = this.tokens;
    }
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnNext(): void {
    this.router.navigate(['/transferencia']);
  }
}
