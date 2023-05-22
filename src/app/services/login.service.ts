import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, authState, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { FirebaseCodeErrorService } from './firebase-code-error.service';
import { Firestore, collection, doc, getDoc, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class LoginService{
  isLoggedIn: Boolean = false;
  loading: boolean = false;
  systemUser = false;
  client!: string;
  constructor(
              private router: Router,
              private afAuth: Auth,
              private afStore:Firestore,
              private toastr: ToastrService,
              private firebaseError:FirebaseCodeErrorService,
              ){
              }

  login(email:any,password:any,clientID:any){
    this.loading = true;
    signInWithEmailAndPassword(this.afAuth,email,password).then(()=>{
      this.isLoggedIn=true;
      this.toastr.clear(); // Oculta las notificaciones anteriores
      this.toastr.success('Has iniciado sesión con exito','Inicio de sesión');
      this.getUserData();
      this.getClient(clientID).then((client) => {
        this.client = client as string;
        this.router.navigate(['/portal']);
      });
    }).catch((error)=>{
      this.loading =false;
      console.log(error);
      this.toastr.error(this.firebaseError.codeError(error.code),'Error');
    });
  }

  logout(){
    signOut(this.afAuth).then(() => this.router.navigate(['/login']));
    this.isLoggedIn= false;
    this.loading=false
  } 

  async getUser() {
    return new Promise((resolve, reject) => {
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

  async getUserData(){
    try {
      const userID = await this.getUser();
      const dbInstance = collection(this.afStore, 'Users');
      const docInstance = doc(dbInstance, userID as string);
      const docSnapshot = await getDoc(docInstance);
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        const role = userData['role'];
        const username = userData['username'];
        const email = userData['email'];
        const user = {'email':email,'role':role,'username':username}
        return user;
      } else {
        console.log('El documento no existe');
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getClient(clientID: any): Promise<string | undefined> {
    const userID = await this.getUser();
    const dbInstance = collection(this.afStore, 'Clientes');
    const docInstance = doc(dbInstance, clientID);
    const docSnapshot = await getDoc(docInstance);
    if (docSnapshot.exists()) {
      const users = docSnapshot.data()['users'];
      for (const user of users) {
        if (user === userID) {
          return clientID;
        }
      }
    }
    return undefined; // Si no se encuentra el cliente o no coincide el userID, se devuelve undefined
  }
}
