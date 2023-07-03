import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Client } from 'src/app/models/client';
import { User } from 'src/app/models/users';
import { CRUDService } from 'src/app/services/crud.service';
import { RolesService } from 'src/app/services/roles.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CRUDComponent implements OnInit {
  @Input() dato = '';
  public users: User[] = [];
  public clients: Client[] = [];
  public activeUsers: User[] = [];
  public activeClients: Client[] = [];
  public filteredUsers: User[] = [];
  public loggedUserClient = '';
  public currentRowIndex = -1;
  public selectedRole!:string;
  public selectedClient!:string;
  public isSystemUser!:boolean;

  constructor(
    private _crudService: CRUDService,
    private _userService: UserService,
    public _roleService: RolesService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.initializeData();
    this.systemUser();
    this.route.queryParams.subscribe((params) => {
      this.dato = params['dato'];
    });
  }

  private async initializeData(): Promise<void> {
    const user = await this._userService.getUserData();
    this.loggedUserClient = user?.client || '';

    const usersArray = await this._crudService.getUsers();
    if (this.loggedUserClient.toLowerCase() === 'sistema') {
      this.users = usersArray;
      this.activeUsers = usersArray.filter((user) => user.activo);
    } else {
      this.activeUsers = usersArray.filter((user) => user.client.toLowerCase() === this.loggedUserClient.toLowerCase());
    }

    const clientesArray = await this._crudService.getClients();
    this.clients = clientesArray;
    this.activeClients = clientesArray.filter((client) => client.activo);
  }

  async editUser(user: User): Promise<void> {
    this.router.navigate(['crud/modify'], { state: { user, dato: this.dato } });
  }

  async addUser(): Promise<void> {
    this.router.navigate(['crud/add-user']);
  }

  async deleteUser(user: User): Promise<void> {
    await this._crudService.deleteUser(user);
    this.activeUsers = this.activeUsers.filter((u) => u['authID'] !== user['authID']);
  }

  async editClient(client: Client): Promise<void> {
    this.router.navigate(['crud/modify'], { state: { client, dato: this.dato } });
  }

  async addClient(): Promise<void> {
    this.router.navigate(['crud/add-client']);
  }

  async deleteClient(client: Client): Promise<void> {
    await this._crudService.deleteClient(client);
    this.activeClients = this.activeClients.filter((c) => c.id !== client.id);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
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

  navigateUp(event: any): void {
    event.preventDefault();
    if (this.currentRowIndex > 0) {
      this.currentRowIndex--;
    }
  }

  navigateDown(event: any): void {
    let rowCount = 0;
    if (this.dato === 'user') {
      rowCount = this.activeUsers.length - 1;
    }
    if (this.dato === 'client') {
      rowCount = this.activeClients.length - 1;
    }
    event.preventDefault();
    if (this.currentRowIndex < rowCount) {
      this.currentRowIndex++;
    }
  }

  callEditMethod(): void {
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

  callDeleteMethod(): void {
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

  async select(): Promise<void> {
    const usersArray = await this._crudService.getUsers();
    if(this.selectedClient === null || this.selectedClient === undefined){
      this.activeUsers = usersArray.filter((user) => user.role.toLowerCase() === this.selectedRole.toLowerCase());
    }
    else if(this.selectedRole === null || this.selectedRole === undefined){
      this.activeUsers = usersArray.filter((user) => user.client.toLowerCase() === this.selectedClient.toLowerCase());
    }else{
      this.activeUsers = usersArray.filter((user) => user.client.toLowerCase() === this.selectedClient.toLowerCase() && user.role.toLowerCase() === this.selectedRole.toLowerCase());
    }
  }  

  async systemUser(){
    if (this.loggedUserClient.toLowerCase() === 'sistema'){
      this.isSystemUser= true;
    }else{
      this.isSystemUser= false;
    }
  }
}
