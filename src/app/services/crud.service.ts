import { Injectable } from '@angular/core';
import { Auth, deleteUser} from '@angular/fire/auth';
import { collection, Firestore, getDocs, doc, setDoc, getDoc } from '@angular/fire/firestore';
import * as admin from 'firebase-admin';


@Injectable({
  providedIn: 'root'
})

export class CRUDService {
  public clients: string[] = [];
  dbInstance = collection(this.afStore, 'Clientes');
  constructor(private afStore: Firestore,
              public afAuth: Auth) {
                // const serviceAccount = require('../credentials/fir-login-cf2d2-firebase-adminsdk-pl1nk-263563ac46.json');
                // admin.initializeApp({
                //   credential: admin.credential.cert(serviceAccount),
                // });      
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

  async deleteClient(clientID:string){
    const docInstance = doc(this.dbInstance, clientID);
    const users = await this.deleteUsersFStore(clientID);
    await this.deleteUsersFAuth(users);
    // deleteDoc(docInstance)
    // .then(()=> {
    //   console.log('Documento eliminado');
    // })
    // .catch((error)=>{
    //   console.log('Error al eliminar documento',error);
    // })
  }

  async deleteUsersFStore(clientID: string): Promise<any[]> {
    const docInstance = doc(this.dbInstance, clientID);
    const docSnapshot = await getDoc(docInstance);
    if (docSnapshot.exists()) {
      const users = docSnapshot.data()['users'];
      console.log('Usuarios:', users);
      return users as any[];
    }
    return [];
  }
  

  async deleteUsersFAuth(users:string[]){
    //  const deleteUserPromises = [];

    //  for (const user of users) {
    //    const deleteUserPromise = admin.auth().deleteUser(user);
    //    deleteUserPromises.push(deleteUserPromise);
    //  }
    //  Promise.all(deleteUserPromises)
    //  .then(() => {
    //    // Todos los usuarios se han borrado correctamente
    //  })
    //  .catch((error) => {
    //    // Manejo de errores al intentar borrar los usuarios
    //  });
  }

}