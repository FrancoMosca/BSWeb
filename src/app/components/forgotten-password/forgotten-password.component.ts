import { Component } from '@angular/core';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotten-password',
  templateUrl: './forgotten-password.component.html',
  styleUrls: ['./forgotten-password.component.css']
})
export class ForgottenPasswordComponent {
  restorePassword: FormGroup;
  loading:boolean =false;
  
  constructor(private fb: FormBuilder,
              private afAuth:Auth,
              private router:Router){
      this.restorePassword = this.fb.group({
      email:['',[Validators.required, Validators.email]],
      })
  }

   restore(){
     const email = this.restorePassword.value.email;
     this.loading =true;
     sendPasswordResetEmail(this.afAuth,email).then(()=>{
       this.router.navigate(['/login']);
    }).catch((error) => {
       this.loading =false;
    })
  }

}
