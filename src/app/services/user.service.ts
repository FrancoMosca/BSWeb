import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afAuth:Auth,
              private afStore:Firestore) {

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
}
