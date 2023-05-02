import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerUser: FormGroup;
  loading: boolean = false;
  
  constructor(private fb:FormBuilder,private afAuth: Auth ,private router: Router){
    this.registerUser = this.fb.group({
      email:['',[Validators.required, Validators.email]],
      password:['',[Validators.required, Validators.minLength(6)]],
      repeatPassword:['',Validators.required],
    })
  }
  ngOnInit(): void{}

  register(){
    const email = this.registerUser.value.email;
    const password = this.registerUser.value.password;
    const repeatPassword = this.registerUser.value.repeatPassword;

    if (password != repeatPassword){
      // this.toastr.error(
      //   'Las contraseñas no coinciden',
      //   'Error'
      //   );
      console.log("las contrasenas no coinciden");
      return;
    }

    this.loading =true;
    createUserWithEmailAndPassword(this.afAuth,email, password)
    .then(()=> {
      this.loading =false;
      this.router.navigate(['/home']);
      return [email,password];
    }).catch((error)=>{
      this.loading =false;
    })
  }
}
