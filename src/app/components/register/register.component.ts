import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword} from '@angular/fire/auth';
import { Firestore, arrayUnion, collection, doc, getDocs, setDoc, updateDoc} from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  roles =[
    {id:1, name:'sistema'},
    {id:2, name:'administrador'},
    {id:3, name:'cliente'},
    {id:4, name:'vendedor'},
    {id:5, name:'proveedor'}
  ];

  constructor(
              private fb:FormBuilder,
              private afAuth: Auth,
              private router: Router,
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
      userRole:['',[Validators.required]]
    })
    this.registerUser.get('clientsId')?.valueChanges.subscribe(val => {
      this._clientService.clientsId = val;
    });
  }
  ngOnInit(): void{}

  public onCatChange(){
    console.log(this.registerUser.value.userRole);
  }

  async register(){
    const email = this.registerUser.value.email;
    const password = this.registerUser.value.password;
    const repeatPassword = this.registerUser.value.repeatPassword;
    const username=this.registerUser.value.username;
    const userRole=this.registerUser.value.userRole -1;
    const clientId : string = this._clientService.clientsId.toLowerCase();
    const dbInstance = collection(this.afStore,'Clientes');
    const dbInstanceUsers = collection(this.afStore,'Users');
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
          username: username,
          role:this.roles[userRole].name,
        }; 
      const docInstance = doc(dbInstance,clientId);
      const docInstanceUser = doc(dbInstanceUsers,uid);
      updateDoc(docInstance, { [`users`]: arrayUnion(uid)});
      setDoc(docInstanceUser,authData);
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