import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TokensComponent } from './components/tokens/tokens.component';
import { TransferenciaComponent } from './components/transferencia/transferencia.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'tokens', component: TokensComponent },
  {path: 'transferencia', component: TransferenciaComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
