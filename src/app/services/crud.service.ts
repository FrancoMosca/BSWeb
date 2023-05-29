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
              ) {}
  
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

  async getUsers(){
    const dbInstance = collection(this.afStore, 'Users');
    const usersArray: any[] = [];
    const querySnapshot = await getDocs(dbInstance);

    querySnapshot.forEach((doc) => {
      const userId = doc.id;
      const userData = doc.data();
      const user = {id:userId,username:userData['username'], email:userData['email'],role:userData['role']}
      usersArray.push(user);
    });
    return usersArray;  
  }
}