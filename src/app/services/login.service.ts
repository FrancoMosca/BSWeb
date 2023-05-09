import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';
import { User } from '../models/users';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FirebaseCodeErrorService } from './firebase-code-error.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService{
  isLoggedIn: Boolean = false;
  loading: boolean = false;
  user$?: Observable<User>;
  
  constructor(
              private router: Router,
              private afAuth: Auth,
              private toastr: ToastrService,
              private firebaseError:FirebaseCodeErrorService,
              ){}

  login(email:any,password:any){
    this.loading = true;
    signInWithEmailAndPassword(this.afAuth,email,password).then(()=>{
      this.router.navigate(['/home']);
      this.isLoggedIn=true;
      this.toastr.success('Has iniciado sesión con exito','Inicio de sesión');
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

  ngOnDestroy(): void {
    this.logout();
  }
}
