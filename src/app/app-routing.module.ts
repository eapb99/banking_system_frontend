import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TokensComponent } from './components/tokens/tokens.component';
import { TransferenciaComponent } from './components/transferencia/transferencia.component';
import { CuentasComponent } from './components/cuentas/cuentas.component';
import { loginGuard } from './guards/login.guard';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [loginGuard]},
  { path: 'tokens', component: TokensComponent, canActivate: [authGuard]},
  { path: 'cuentas', component: CuentasComponent },
  {path: 'transferencia', component: TransferenciaComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
