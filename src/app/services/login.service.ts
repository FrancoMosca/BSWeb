import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';
import { User } from '../models/users';
import { Observable } from 'rxjs';

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
              ){}

  login(email:any,password:any){
    this.loading = true;
    signInWithEmailAndPassword(this.afAuth,email,password).then((user)=>{

      this.router.navigate(['/home']);
      this.isLoggedIn=true;

    }).catch((error)=>{
      this.loading =false;
      console.log(error);
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
