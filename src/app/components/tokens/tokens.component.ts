import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.css']
})
export class TokensComponent implements OnInit {

  tokens: any[] = [];  // Lista de tokens obtenidos del backend
  dataSource: MatTableDataSource<any>;  // DataSource para la tabla con paginación
  filter: string = 'all';  // Filtro por defecto (todos los tokens)
  cuentaOrigen: any[] = [];  // Información de la cuenta de origen
  displayedColumns: string[] = ['token', 'generado_en', 'usado_en', 'es_valido'];  // Columnas de la tabla

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private authService: AuthService, private router: Router) {
    this.dataSource = new MatTableDataSource(this.tokens);  // Inicializar DataSource
  }

  ngOnInit(): void {
    // Llamar al servicio para obtener los tokens
    this.authService.listarTokens().subscribe(
      (response) => {
        this.tokens = response.tokens;
        this.dataSource.data = this.tokens;  
        this.dataSource.paginator = this.paginator;  
        this.applyFilter(); 
      },
      (error) => {
        console.error('Error al obtener tokens:', error);
      }
    );
  }

  applyFilter(): void {
    if (this.filter === 'valid') {
      this.dataSource.data = this.tokens.filter(token => token.es_valido);
    } else if (this.filter === 'invalid') {
      this.dataSource.data = this.tokens.filter(token => !token.es_valido);
    } else {
      this.dataSource.data = this.tokens;
    }
    this.dataSource.paginator = this.paginator;  
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnNext(): void {
    this.router.navigate(['/transferencia']);
  }

  listarCuentas(): void {
    this.router.navigate(['/cuentas']);
  }
}
