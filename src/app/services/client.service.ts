import { Injectable, OnInit } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ClientService implements OnInit {
  public clients: any[] = [];
  public clientsId : string= '';

  constructor(private afStore: Firestore) { 
    this.ngOnInit();
  }
  async ngOnInit(){
    this.clients = await this.getClients();
  }

  onClienteChange(){
    // console.log(this.clientsId);
  }

  async getClients(){
    const dbInstance = collection(this.afStore, 'Clientes');
    const docsSnap = await getDocs(dbInstance);

    const clients: any = [];

    docsSnap.forEach(doc => {
      const data = doc.data();
      data['id'] = doc.id; 
      clients.push(data);
    })
    return clients;
  }
}
