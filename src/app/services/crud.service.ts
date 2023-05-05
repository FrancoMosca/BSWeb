import { Injectable } from '@angular/core';
import {  collection,
          Firestore,
          addDoc,
          getDocs,
          updateDoc,
          doc,
          deleteDoc
         } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CRUDService {
  public data: any = []
  constructor(private fs:Firestore) { }
  
  addData(value:any){
    const dbInstance = collection(this.fs,'users');
    addDoc(dbInstance,value)
    .then(()=>{
      alert('Data Sent')
    })
    .catch((err) =>{
      alert(err.message)
    })
  }

  getData() {
    const dbInstance = collection(this.fs, 'users');
    getDocs(dbInstance)
      .then((response) => {
        this.data = [...response.docs.map((item) => {
          return { ...item.data(), id: item.id }
        })]
      })
  }

  updateData(id: string) {
    const dataToUpdate = doc(this.fs, "'"+id+"'", id);
    updateDoc(dataToUpdate, {
      
      // name: '',
      // email: ''
    })
      .then(() => {
        alert('Data updated');
        this.getData()
      })
      .catch((err) => {
        alert(err.message)
      })
  }

  deleteData(id: string) {
    const dataToDelete = doc(this.fs, 'users', id);
    deleteDoc(dataToDelete)
    .then(() => {
      alert('Data Deleted');
      this.getData()
    })
    .catch((err) => {
      alert(err.message)
    })
  }
}
