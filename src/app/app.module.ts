import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//IMPORTS
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAuth,getAuth, } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//COMPONENTES
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ForgottenPasswordComponent } from './components/forgotten-password/forgotten-password.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddClientComponent } from './components/add-client/add-client.component';
import { PortalComponent } from './components/portal/portal.component';
import { RoleDirective } from './directives/role.directive';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CrudClientesComponent } from './components/crud-clientes/crud-clientes.component';
import { ModifyClientComponent } from './components/modify-client/modify-client.component';
import { ClientBoxComponent } from './components/client-box/client-box.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    SpinnerComponent,
    ForgottenPasswordComponent,
    HomeComponent,
    DashboardComponent,
    AddClientComponent,
    PortalComponent,
    RoleDirective,
    NavbarComponent,
    CrudClientesComponent,
    ModifyClientComponent,
    ClientBoxComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbModalModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


