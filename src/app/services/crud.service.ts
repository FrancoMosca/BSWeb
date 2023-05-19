import { Injectable } from '@angular/core';
import { collection, Firestore, addDoc, getDocs, updateDoc, doc, deleteDoc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CRUDService {
  public clients: string[] = [];
  dbInstance = collection(this.afStore, 'Clientes');
  constructor(private afStore: Firestore) {
  }
  
  addClient(client: any) {
    const docInstance = doc(this.dbInstance, client);
    const docData = {
      activo: true,
      users: [],
    };
    setDoc(docInstance, docData);
  }

  async getClients(): Promise<string[]> {
    const querySnapshot = await getDocs(this.dbInstance);
    const clientesArray: string[] = [];

    querySnapshot.forEach((doc) => {
      const clienteId = doc.id;
      clientesArray.push(clienteId);
    });

    return clientesArray;
  }

  deleteClient(clientID:string){
    const docInstance = doc(this.dbInstance, clientID);
    deleteDoc(docInstance)
    .then(()=> {
      console.log('Documento eliminado');
    })
    .catch((error)=>{
      console.log('Error al eliminar documento',error);
    })
  }

  deleteUsersFStore(clientID:string){
    const docInstance = doc(this.dbInstance, clientID);
  }

}