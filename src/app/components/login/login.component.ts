import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service'
import { Firestore, collection, doc, getDoc, getDocs} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userLogin: FormGroup;
  isSubmitting = false;
  constructor(public loginService:LoginService,
              public fb:FormBuilder,
              public _clientService:ClientService,
              private afStore:Firestore,
              public toastr:ToastrService)
        {
          this.userLogin = this.fb.group({
            username:['',[Validators.required]],
            password:['',[Validators.required, Validators.minLength(6)]],
            client:['',[Validators.required]],
          });
        }
  
  ngOnInit(): void {
    
  }

  async login() {
    const username = this.userLogin.value.username;
    const client = this.userLogin.value.client;
    const dbInstance = collection(this.afStore, 'Clientes');
    const querySnapshot = await getDocs(dbInstance);
  
    const clientDoc = querySnapshot.docs.find(doc => doc.data()['nombre'].toLowerCase() === client.toLowerCase());
  
    if (clientDoc) {
      const docInstance = doc(dbInstance, clientDoc.id);
      const docSnapshot = await getDoc(docInstance);
  
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
  
        if (data && data['users'] && Array.isArray(data['users'])) {
          const dbInstanceUsers = collection(this.afStore, 'Users');
          const usersArray = data['users'];
  
          let foundUser = false;
  
          for (const user of usersArray) {
            const docInstanceUsers = doc(dbInstanceUsers, user);
            const docSnapshotUsers = await getDoc(docInstanceUsers);
  
            if (docSnapshotUsers.exists() && docSnapshotUsers.data()['username'].toLowerCase() === username.toLowerCase()) {
              foundUser = true;
              return this.loginService.login(docSnapshotUsers.data()['email'], this.userLogin.value.password, client);
            }
          }
  
          if (!foundUser) {
            this.toastr.error('No existe ese usuario en el cliente', 'Error');
          }
        }
      }
    } else {
      this.toastr.error('No existe el cliente', 'Error');
    }
  }

  submitForm() {
    if (this.isSubmitting) {
      return false;
    }
  
    this.isSubmitting = true;
    var submitButton = document.getElementById("submit");
    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true; 
    }
    
    setTimeout(() => {
      this.isSubmitting = false;
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
      }
    }, 9000);
  
    return false;
  }
  
}
