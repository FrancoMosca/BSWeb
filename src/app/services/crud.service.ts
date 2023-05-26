import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, Firestore, getDocs, doc, setDoc, getDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { ModifyClientComponent } from '../components/modify-client/modify-client.component'


@Injectable({
  providedIn: 'root'
})

export class CRUDService {
  public clients: string[] = [];
  dbInstance = collection(this.afStore, 'Clientes');
  usersInstance = collection(this.afStore, 'Users');
  constructor(private afStore: Firestore,
              public afAuth: Auth,
              ) {
                // const serviceAccount = require('../credentials/fir-login-cf2d2-firebase-adminsdk-pl1nk-263563ac46.json');
                // admin.initializeApp({
                //   credential: admin.credential.cert(serviceAccount),
                // });      
  }
  
  addClient(client: any) {
    const docInstance = doc(this.dbInstance);
    const docData = {
      activo: true,
      users: [],
      nombre:client,
    };
    setDoc(docInstance, docData);
  }

  async getClients(): Promise<any[]> {
    const querySnapshot = await getDocs(this.dbInstance);
    const clientesArray: any[] = [];
  
    querySnapshot.forEach((doc) => {
      const clienteId = doc.id;
      const clientData = doc.data();
      const client = { id: clienteId, activo: clientData['activo'], ...clientData };
      clientesArray.push(client);
    });
  
    return clientesArray;  
  }

  async deleteClient(client:any) {
    console.log(client.name)
    const querySnapshot = await getDocs(this.dbInstance);
    const clientDoc = querySnapshot.docs.find(
      doc => doc.data()['nombre'].toLowerCase === client.name.toLowerCase
    );
  
    if (clientDoc) {
      const docRef = doc(this.dbInstance, clientDoc.id);
      const newData = {
        activo: false
      };
  
      try {
        await updateDoc(docRef, newData);
        console.log('Documento actualizado correctamente');
      } catch (error) {
        console.error('Error al actualizar el documento:', error);
      }
    } else {
      console.log('No se encontró el cliente');
    }
  }  

  async deleteUsersFStore(clientID: string) {
    const docInstance = doc(this.dbInstance, clientID);
    const docSnapshot = await getDoc(docInstance);
    const userSnapshot = await getDocs(this.usersInstance);
  
    if (docSnapshot.exists()) {
      const users = docSnapshot.data()['users'];
      console.log('Usuarios:', users);
  
      userSnapshot.forEach(doc => {
        users.forEach((user: string) => {
          if (doc.id === user) {
            const userDocRef = doc.ref;
            deleteDoc(userDocRef)
              .then(() => console.log('Documento eliminado correctamente:', user))
              .catch(error => console.error('Error al eliminar el documento:', error));
          }
        });
      });
    }
  }

  async modifyDoc(clientID: string, newIdClient: string){
    const dbInstance = collection(this.afStore, 'Clientes');
    const querySnapshot = await getDocs(dbInstance);
    const clientDoc = querySnapshot.docs.find(doc => doc.data()['nombre'] == clientID.toLowerCase());
    if (clientDoc) {
      const docRef = doc(this.dbInstance, clientDoc.id);
      const newData = {
        nombre: newIdClient,
      };
  
      try {
        await updateDoc(docRef, newData);
        console.log('Documento actualizado correctamente');
      } catch (error) {
        console.error('Error al actualizar el documento:', error);
      }
    } else {
      console.log('No se encontró el cliente');
    }

  }



  // async deleteUsersFAuth(users:any[]){
  //   // const deleteUserPromises = [];

  //   // for (const user of users) {
  //   // const deleteUserPromise = admin.auth().deleteUser(user);
  //   // deleteUserPromises.push(deleteUserPromise);
  //   // }
  //   // Promise.all(deleteUserPromises)
  //   // .then(() => {
  //   //   // Todos los usuarios se han borrado correctamente
  //   //   console.log("se borro")
  //   // })
  //   // .catch((error) => {
  //   //   // Manejo de errores al intentar borrar los usuarios
  //   //   console.log("error",error)
  //   // });
  // }

}