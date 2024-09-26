import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private route: Router) { }

  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        const token = response.access;  // Recibimos el token de acceso
        this.authService.saveToken(token);  // Guardamos el token en localStorage

        // Decodificar el token para obtener el user_id o username
        const userInfo = this.authService.getUserInfoFromToken();
        console.log('Información del usuario:', userInfo);  // Aquí tendrás el user_id y el username

        // Aquí puedes redirigir al usuario a otra página, por ejemplo, un dashboard
        this.route.navigate(['/tokens']);      
      },
      (error) => {
        console.error('Error al iniciar sesión', error);
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    );
  }
}
