import { Injectable } from '@angular/core';
import {  collection,
          Firestore,
          addDoc,
          getDocs,
          updateDoc,
          doc,
          deleteDoc,
          setDoc
         } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CRUDService {
  constructor(private afStore:Firestore) { }
  
  addClient(client:any){
    const dbInstance = collection(this.afStore,'Clientes')
    const docInstance = doc(dbInstance,client)
    const docData = {
      activo :true,
      users:[],
    }
    setDoc(docInstance,docData)
  }

}
