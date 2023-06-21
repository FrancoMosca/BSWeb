import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { ForgottenPasswordComponent } from './components/forgotten-password/forgotten-password.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PortalComponent } from './components/portal/portal.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AddClientComponent } from './components/add-client/add-client.component';
import { SubNavbarComponent } from './components/sub-navbar/sub-navbar.component';
import { CRUDComponent } from './components/crud/crud.component';
import { ModifyComponent } from './components/modify/modify.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgotten-password', component: ForgottenPasswordComponent },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'portal', component: PortalComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'subnavbar', component: SubNavbarComponent },
  { path: 'crud', component: CRUDComponent },
  { path: 'crud/add-client', component: AddClientComponent },
  { path: 'crud/add-user', component: AddUserComponent },
  { path: 'crud/modify', component: ModifyComponent },
  { path: '**', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
