import { Injectable, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/users';
import { FirestoreService } from './firestore.service';
import { RolesService } from './roles.service';

@Injectable({
  providedIn: 'root'
})
export class CRUDService implements OnInit {
  public clients: any[] = [];
  public users: User[] = [];

  constructor(
    private _firestoreService: FirestoreService,
    public afAuth: Auth,
    private toastr: ToastrService,
    private _rolesService: RolesService,
  ) {
    this.getClients().then((clientesArray) => {
      this.clients = clientesArray;
    });
  }

  ngOnInit(): void {}

  addClient(client: { value: { users: User[]; activo: boolean; nombre: string; email: string; telefono: string } }) {
    if (client.value) {
      const nombreExistente = this.clients.some((c) => c.nombre === client.value.nombre);
      const emailExistente = this.clients.some((c) => c.email === client.value.email);
      const telefonoExistente = this.clients.some((c) => c.telefono === client.value.telefono);

      if (nombreExistente) {
        this.toastr.error('El nombre del cliente ya está ocupado', 'Error');
        return;
      }

      if (emailExistente) {
        this.toastr.error('El correo electrónico ya está registrado por otro cliente', 'Error');
        return;
      }

      if (telefonoExistente) {
        this.toastr.error('El número de teléfono ya está registrado por otro cliente', 'Error');
        return;
      }

      client.value.users = [];
      client.value.activo = true;

      this._firestoreService.addDocument('Clientes', client.value);
    }
  }

  async getClients(): Promise<any[]> {
    return this._firestoreService.getDocuments('Clientes');
  }

  async deleteClient(client: any) {
    const clientDocument = this.clients.find((c) => c.nombre.toLowerCase() === client.nombre.toLowerCase());

    if (clientDocument) {
      const newData = { activo: false };
      this._firestoreService.updateDocument('Clientes', clientDocument.id, newData);
    } else {
      this.toastr.error('No se encontró el cliente', 'Error');
    }
  }

  async deleteUser(user: User) {
    const userDocuments = this.clients.filter((c) => c.users.includes(user.authID));

    userDocuments.forEach(async (document) => {
      const updatedUsers = document.users.filter((userId:any) => userId !== user.authID);
      const newData = { users: updatedUsers };
      await this._firestoreService.updateDocument('Clientes', document.id, newData);
    });

    const userData = await this._firestoreService.getDocuments('Users');
    const userDocument = userData.find((userData) => userData.authID === user.authID);

    if (userDocument) {
      const newData = { activo: false };
      await this._firestoreService.updateDocument('Users', userDocument.id, newData);
    } else {
      this.toastr.error('No se encontró el usuario', 'Error');
    }
  }

  async getUsers() {
    return this._firestoreService.getDocuments('Users');
  }

  async addUser(user: any) {
    const { 
            email,
            password,
            repeatPassword,
            username,
            client,
            userRole
          } = user.value;

    const selectedRole = this._rolesService.roles.find((role) => role['id'] == userRole);
    const usernameTaken = await this.checkUsernameAvailability(username);

    if (usernameTaken) {
      this.toastr.error('El nombre de usuario ya está tomado', 'Error');
      return;
    }

    if (password === repeatPassword) {
      if (selectedRole) {
        const userRole = selectedRole['name'];
        const data = {
          activo: true,
          email,
          username,
          client,
          role: userRole
        };
        const tempData = {
          email,
          password,
          username,
          client,
          role: userRole
        };
        await this._firestoreService.addDocument('addUsers', tempData);
        await this._firestoreService.addDocument('Users', data);
      } else {
        this.toastr.error('ID de rol no válido', 'Error');
      }
    } else {
      this.toastr.error('Las contraseñas no coinciden', 'Error');
    }
  }

  async checkUsernameAvailability(username: string): Promise<boolean> {
    const userData = await this._firestoreService.getDocuments('Users');
    return userData.some((userData) => userData.username === username);
  }
}
