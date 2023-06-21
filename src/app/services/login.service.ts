import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { FirebaseCodeErrorService } from './firebase-code-error.service';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  isLoggedIn: boolean = false;
  loading: boolean = false;
  systemUser = false;
  client!: string;

  constructor(
    private router: Router,
    private afAuth: Auth,
    private afStore: Firestore,
    private toastr: ToastrService,
    private firebaseError: FirebaseCodeErrorService,
  ) {}

  async login(email: any, password: any) {
    this.loading = true;
    signInWithEmailAndPassword(this.afAuth, email, password).then(async () => {
      this.isLoggedIn = true;
      this.toastr.clear();
      this.toastr.success('Has iniciado sesión con éxito', 'Inicio de sesión');
      await this.getUserData();
      this.isLoggedIn = false;
      this.router.navigate(['/portal']);
    }).catch((error: any) => {
      this.loading = false;
      this.toastr.error(this.firebaseError.codeError(error.code), 'Error');
    });
  }

  logout() {
    signOut(this.afAuth).then(() => this.router.navigate(['/login']));
    this.isLoggedIn = false;
    this.loading = false;
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
