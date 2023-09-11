import { Injectable, OnInit } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Client } from '../models/client';
import { User } from '../models/users';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ClientService implements OnInit {
  public clients: Client[] = [];

  constructor(
      private _firestoreService: FirestoreService,
      private toastr: ToastrService,
      ) 
  { 
    this.ngOnInit();
  }
  async ngOnInit(){
    this.clients = await this.getClients();
  }

  async getClients(): Promise<any[]> {
    return this._firestoreService.getDocuments('Clientes');
  }

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

  async deleteClient(client: any) {
    const clientDocument = this.clients.find((c) => c.nombre.toLowerCase() === client.nombre.toLowerCase());

    if (clientDocument) {
      const newData = { activo: false };
      this._firestoreService.updateDocument('Clientes', clientDocument.id, newData);
    } else {
      this.toastr.error('No se encontró el cliente', 'Error');
    }
  }

  // async getClients(){
  //   const dbInstance = collection(this.afStore, 'Clientes');
  //   const docsSnap = await getDocs(dbInstance);

  //   const clients: any = [];

  //   docsSnap.forEach(doc => {
  //     const data = doc.data();
  //     data['id'] = doc.id; 
  //     clients.push(data);
  //   })
  //   return clients;
  // }

  
}
