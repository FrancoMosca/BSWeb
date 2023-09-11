import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, addDoc, updateDoc, doc } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private afStore: Firestore, private toastr: ToastrService) {}

  async addDocument(collectionName: string, data: any) {
    try {
      await addDoc(collection(this.afStore, collectionName), data);
      this.toastr.success('Documento agregado exitosamente', 'Acción exitosa');
    } catch (error) {
      this.toastr.error('Ocurrió un error al agregar el documento: ' + error, 'Error');
    }
  }

  async updateDocument(collectionName: string, documentId: string, newData: any) {
    try {
      const docRef = doc(this.afStore, collectionName, documentId);
      console.log(newData);
      await updateDoc(docRef, newData);
      this.toastr.success('Documento actualizado exitosamente', 'Acción exitosa');
    } catch (error) {
      this.toastr.error('Error al actualizar el documento: ' + error, 'Error');
    }
  }

  async getDocuments(collectionName: string): Promise<any[]> {
    const querySnapshot = await getDocs(collection(this.afStore, collectionName));
    const documentsArray: any[] = [];

    querySnapshot.forEach((doc) => {
      const documentId = doc.id;
      const documentData = doc.data();
      const document = { id: documentId, ...documentData };
      documentsArray.push(document);
    });

    return documentsArray;
  }
}
