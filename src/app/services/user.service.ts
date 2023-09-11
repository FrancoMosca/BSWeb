import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';
import { FirestoreService } from './firestore.service';
import { User } from '../models/users';
import { ToastrService } from 'ngx-toastr';
import { RolesService } from './roles.service';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afAuth:Auth,
              private afStore:Firestore,
              private _firestoreService: FirestoreService,
              private toastr: ToastrService,
              private _rolesService: RolesService,
              private _clientService: ClientService) {

  }
  async getUser(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.afAuth.onAuthStateChanged((user) => {
        if (user) {
          const uid = user.uid;
          resolve(uid);
        } else {
          reject(new Error('User not authenticated'));
        }
      });
    });
  }

  async getUserData() {
    try {
      const userID = await this.getUser();
      const docQuery = query(collection(this.afStore, 'Users'), where('authID', '==', userID));
      let querySnapshot = await getDocs(docQuery);

      while (querySnapshot.empty) {
        // Esperar un tiempo antes de realizar la siguiente consulta
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Realizar la consulta nuevamente
        querySnapshot = await getDocs(docQuery);
      }

      const docSnapshot = querySnapshot.docs[0];
      const userData = docSnapshot.data();
      const { role, username, email, client } = userData;
      const user = { email, role, username, client };
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteUser(user: User) {
    const userDocuments = this._clientService.clients.filter((c) => c.users.includes(user.authID));

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
