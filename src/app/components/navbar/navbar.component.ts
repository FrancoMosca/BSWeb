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
  public client!: string;
  constructor(public _loginService:LoginService){
  }
  
  ngOnInit(): void {
    this._loginService.getUserData().then(user => {
      this.role = user?.role || '';
      this.username = user?.username || '';
      this.client = user?.client || '';
    });
  }

}
