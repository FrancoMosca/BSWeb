import { Component } from '@angular/core';
import { Auth, User, createUserWithEmailAndPassword} from '@angular/fire/auth';
import { Firestore, addDoc, arrayUnion, collection, doc, updateDoc} from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService} from 'src/app/services/login.service';
import { ClientService } from '../../services/client.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerUser: FormGroup;
  loading: boolean = false;

  constructor(
              private fb:FormBuilder,
              private afAuth: Auth,
              private router: Router,
              private _loginService:LoginService,
              public _clientService:ClientService,
              private afStore:Firestore,
              ){
    this.registerUser = this.fb.group({
      email:['',[Validators.required, Validators.email]],
      password:['',[Validators.required, Validators.minLength(6)]],
      repeatPassword:['',Validators.required],
      clientsId:['',[Validators.required]],
    })
    this.registerUser.get('clientsId')?.valueChanges.subscribe(val => {
      this._clientService.clientsId = val;
    });
  }
  ngOnInit(): void{}

  register(){
    const email = this.registerUser.value.email;
    const password = this.registerUser.value.password;
    const repeatPassword = this.registerUser.value.repeatPassword;

    if (password != repeatPassword){
      console.log("las contrasenas no coinciden");
      return;
    }

    this.loading =true;
    createUserWithEmailAndPassword(this.afAuth,email, password)
    .then((user)=> {     
      this.loading =false;

      const uid = this.afAuth.currentUser?.uid;
      const authData = {
        email: this.afAuth.currentUser?.email,
        uid: uid,
      }; 
      const dbInstance = collection(this.afStore,'Clientes')
      const clientId : string = this._clientService.clientsId
      const docInstance = doc(dbInstance,clientId);
      updateDoc(docInstance, { [`users`]: arrayUnion(authData)});
      this._loginService.login(email,password);
      this.router.navigate(['/home']);
    }).catch((error)=>{
      this.loading =false;
    })
  }
  
}