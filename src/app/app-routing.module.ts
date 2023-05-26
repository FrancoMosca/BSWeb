import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgottenPasswordComponent } from './components/forgotten-password/forgotten-password.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PortalComponent } from './components/portal/portal.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CrudClientesComponent } from './components/crud-clientes/crud-clientes.component';
import { ClientBoxComponent } from './components/client-box/client-box.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgotten-password', component: ForgottenPasswordComponent },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'portal', component: PortalComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'crud-clientes', component: CrudClientesComponent },
  { path: 'client-box', component: ClientBoxComponent },
  { path: '**', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
