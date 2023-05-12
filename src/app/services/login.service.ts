import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithCustomToken, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';
import { User } from '../models/users';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FirebaseCodeErrorService } from './firebase-code-error.service';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService{
  isLoggedIn: Boolean = false;
  loading: boolean = false;
  user$?: Observable<User>;
  adminUser = false;
  constructor(
              private router: Router,
              private afAuth: Auth,
              private toastr: ToastrService,
              private firebaseError:FirebaseCodeErrorService,
              private _clientService:ClientService,
              ){}

  login(email:any,password:any){
    this.loading = true;
    signInWithEmailAndPassword(this.afAuth,email,password).then(()=>{
      this.isLoggedIn=true;
      this.toastr.success('Has iniciado sesión con exito','Inicio de sesión');
      if(this._clientService.clientsId.toLowerCase()=='admins'){
        this.adminUser = true;
        this.router.navigate(['/dashboard']);
      }else{
        this.router.navigate(['/home']);
      }
    }).catch((error)=>{
      this.loading =false;
      console.log(error);
      this.toastr.error(this.firebaseError.codeError(error.code),'Error');
    });
  }

  logout(){
    signOut(this.afAuth).then(() => this.router.navigate(['/home']));
    this.isLoggedIn= false;
  }

  // ngOnDestroy(): void {
  //   this.logout();
  // }
}
