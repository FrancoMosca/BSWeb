import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  public role!:string;
  public username!:string;
  public client : string = this._loginService.client
  constructor(public _loginService:LoginService){

  }
  
  ngOnInit(): void {
    this._loginService.getUserData().then(user => {
      this.role = user?.role || ''; // Asignar el valor de 'role' a la propiedad 'role' del componente
      this.username = user?.username || '';
    });
  }
  
}
