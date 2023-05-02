import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, signOut, authState } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class LoginService{
  userLogin: FormGroup;
  isLoggedIn: Boolean = false;
  loading: boolean = false;
  constructor(
              private router: Router,
              private auth: Auth,              
              public fb:FormBuilder,
              ){

    this.userLogin = this.fb.group({
      email:['',[Validators.required, Validators.email]],
      password:['',[Validators.required, Validators.minLength(6)]],
    });
  }

  login(){
    const email = this.userLogin.value.email;
    const password = this.userLogin.value.password;

    this.loading =true;
    signInWithEmailAndPassword(this.auth,email,password).then((user)=>{
      this.router.navigate(['/home']);
      this.isLoggedIn=true;
    }).catch((error)=>{
      this.loading =false;
      console.log(error);
    });
  }

  logout(){
    signOut(this.auth).then(() => this.router.navigate(['/home']));
    this.isLoggedIn= false;
  }

  ngOnDestroy(): void {
    this.logout();
  }
}
