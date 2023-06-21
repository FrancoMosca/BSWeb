import { Component, HostListener, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from 'src/app/models/client';
import { User } from 'src/app/models/users';
import { CRUDService } from 'src/app/services/crud.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CRUDComponent {
  @Input() dato: string ='';
  public users: User[]=[]
  public clients: Client[] = [];
  public activeUsers: User []=[];
  public activeClients: Client[]=[];
  public loggedUserClient!:string;
  public currentRowIndex: number = -1;

  constructor(
    public _crudService:CRUDService,
    public _loginService:LoginService,
    private router:Router,
    private route: ActivatedRoute
  ) {
    this._loginService.getUserData().then(user => {
      this.loggedUserClient = user?.client || '';
    });   
  }

  ngOnInit(): void {
    this._crudService.getUsers().then((usersArray) => {
      if (this.loggedUserClient.toLowerCase() === "sistema") {
        this.users = usersArray;
        this.activeUsers=usersArray.filter((user) => user.activo);
      } else {
        this.users = usersArray.filter((user) => user.client === this.loggedUserClient.toLowerCase());
      }
    });

    this._crudService.getClients().then((clientesArray) => {
      this.clients = clientesArray;
      this.activeClients =clientesArray.filter((client) => client.activo);
    });

    this.route.queryParams.subscribe(params => {
      this.dato = params['dato'];
    });
  }
  
  //USER

  async editUser(user: User) {
    this.router.navigate(['crud/modify'], { state: { user,dato:this.dato } });
  }

  async addUser(){
    this.router.navigate(['crud/add-user']);
  }

  async deleteUser(user: User){
    this._crudService.deleteUser(user);
    this.activeUsers=this.activeUsers.filter((u)=>u['authID'] !== user['authID']);
  }

  //CLIENT

  async editClient(client: Client) {
    this.router.navigate(['crud/modify'], { state: { client,dato:this.dato  } });
  }

  async addClient() {
    this.router.navigate(['crud/add-client']);
  }

  async deleteClient(client: Client){
    this._crudService.deleteClient(client);
    this.activeClients=this.activeClients.filter((c)=>c.id !== client.id);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        this.navigateUp(event);
        break;
      case 'ArrowDown':
        this.navigateDown(event);
        break;
      case 'o':
        this.callEditMethod();
        break;
      case 'p':
        this.callDeleteMethod();
        break;
    }
  }

  navigateUp(event:any) {
    event.preventDefault();
    if (this.currentRowIndex > 0) {
      this.currentRowIndex--;
    }
  }

  navigateDown(event:any) {
    let rowCount!: number;
    if(this.dato==='user'){
      rowCount = this.activeUsers.length-1;
    }
    if(this.dato==='client'){
      rowCount = this.activeClients.length-1;
    }
    event.preventDefault();
    if (this.currentRowIndex < rowCount) {
      this.currentRowIndex++;
    }
  }

  callEditMethod() {
    let selectedElement: any;
  
    if (this.dato === 'user') {
      selectedElement = this.activeUsers[this.currentRowIndex];
      if (selectedElement) {
        this.editUser(selectedElement);
      }
    } else if (this.dato === 'client') {
      selectedElement = this.activeClients[this.currentRowIndex];
      if (selectedElement) {
        this.editClient(selectedElement);
      }
    }
  }
  
  callDeleteMethod() {
    let selectedElement: any;
  
    if (this.dato === 'user') {
      selectedElement = this.activeUsers[this.currentRowIndex];
      if (selectedElement) {
        this.deleteUser(selectedElement);
      }
    } else if (this.dato === 'client') {
      selectedElement = this.activeClients[this.currentRowIndex];
      if (selectedElement) {
        this.deleteClient(selectedElement);
      }
    }
  }
  
}
