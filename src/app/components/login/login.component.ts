import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service'
import { Firestore, collection, doc, getDoc} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userLogin: FormGroup;
  constructor(public loginService:LoginService,
              public fb:FormBuilder,
              public _clientService:ClientService,
              private afStore:Firestore,
              private toastr:ToastrService)
        {
          this.userLogin = this.fb.group({
            username:['',[Validators.required]],
            password:['',[Validators.required, Validators.minLength(6)]],
            clientsId:['',[Validators.required]],
          });

          this.userLogin.get('clientsId')?.valueChanges.subscribe(val => {
            this._clientService.clientsId = val;
          });
          
        }
  
  ngOnInit(): void {
    
  }

  async login(){
    const username = this.userLogin.value.username;
    const dbInstance = collection(this.afStore,'Clientes')
    const docInstance = doc(dbInstance, this._clientService.clientsId.toLowerCase())
    const docSnapshot = await getDoc(docInstance)
    if (docSnapshot.exists()) {
      const usersArray = docSnapshot.data()['users'];
      let foundUser = false;
      usersArray.forEach((user: { username: any;email:any }) => {
        if (user.username == username.toLowerCase()) {
          this.loginService.login(user.email,this.userLogin.value.password);
          foundUser = true;
        }
      });
      if (!foundUser) {
        this.toastr.error('No existe ese usuario en el cliente','Error');
      }
    } else {
      this.toastr.error('No existe ese cliente','Error');
    }
  }
}
