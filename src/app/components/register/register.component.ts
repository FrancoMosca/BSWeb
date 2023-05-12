import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword} from '@angular/fire/auth';
import { Firestore, arrayUnion, collection, doc, getDocs, updateDoc} from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService} from 'src/app/services/login.service';
import { ClientService } from '../../services/client.service';
import { ToastrService } from 'ngx-toastr';
import { FirebaseCodeErrorService } from '../../services/firebase-code-error.service';

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
              private toastr: ToastrService,
              private firebaseError:FirebaseCodeErrorService,
              ){
    this.registerUser = this.fb.group({
      username:['',[Validators.required]],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required, Validators.minLength(6)]],
      repeatPassword:['',Validators.required],
      clientsId:['',[Validators.required]],
    })
    this.registerUser.get('clientsId')?.valueChanges.subscribe(val => {
      this._clientService.clientsId = val;
    });
  }
  ngOnInit(): void{}

  async register(){
    const email = this.registerUser.value.email;
    const password = this.registerUser.value.password;
    const repeatPassword = this.registerUser.value.repeatPassword;
    const username=this.registerUser.value.username;
    const clientId : string = this._clientService.clientsId.toLowerCase();
    const dbInstance = collection(this.afStore,'Clientes');
    const docsID:Array<String> = []
    const docs = await getDocs(dbInstance)
    docs.forEach((doc) => {
      docsID.push(doc.id);
    });

    if (password != repeatPassword){
      this.toastr.error(
        'Las contraseñas no coinciden',
        'Error'
        );
      return;
    }
    if (docsID.includes(clientId)){
      this.loading =true;
      createUserWithEmailAndPassword(this.afAuth,email, password)
      .then(async (user)=> {     
        this.loading =false;
        this.toastr.success('El usuario se registro con exito','Usuario registrado');
        const uid = this.afAuth.currentUser?.uid;
        const authData = {
          email: email,
          uid: uid,
          username: username,
        }; 
      const docInstance = doc(dbInstance,clientId);
      updateDoc(docInstance, { [`users`]: arrayUnion(authData)});
      // this._loginService.login(email,password);
    }).catch((error)=>{
      this.loading =false;
      this.toastr.error(this.firebaseError.codeError(error.code),'Error');
    })
  }
    else{
      this.toastr.error('Ese cliente no existe','Error');
    }
  }
  
}