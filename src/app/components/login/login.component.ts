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
            email:['',[Validators.required, Validators.email]],
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

    const dbInstance = collection(this.afStore,'Clientes')
    const docInstance = doc(dbInstance, this._clientService.clientsId.toLowerCase())
    const docSnapshot = await getDoc(docInstance)
    if (docSnapshot.exists()) {
      const usersArray = docSnapshot.data()['users'];
      let foundUser = false;
      usersArray.forEach((user: { email: any; }) => {
        if (user.email == this.userLogin.value.email.toLowerCase()) {
          this.loginService.login( this.userLogin.value.email,this.userLogin.value.password);
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
