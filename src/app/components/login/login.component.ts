import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service'
import { Firestore, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc, query, where, persistentMultipleTabManager} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userLogin: FormGroup;
  isSubmitting = false;
  constructor(public _loginService:LoginService,
              public fb:FormBuilder,
              private afStore:Firestore,
              private afAuth:Auth,
              public toastr:ToastrService,
              private router:Router)
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
    let client = this.userLogin.value.client;
    client = client.charAt(0).toUpperCase() + client.slice(1);
    const password = this.userLogin.value.password;
    const dbInstance = collection(this.afStore, 'Clientes');
    const querySnapshot = await getDocs(dbInstance);
    const addUsersInstance = collection(this.afStore, 'addUsers');
    const addUsersquerySnapshot = await getDocs(addUsersInstance);
    
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
            const docQuery = query(dbInstanceUsers, where('authID', '==', user));
            const querySnapshotUsers = await getDocs(docQuery);
          
            if (!querySnapshotUsers.empty) {
              const docSnapshotUsers = querySnapshotUsers.docs[0];
          
              if (docSnapshotUsers.data()['username'].toLowerCase() === username.toLowerCase() && docSnapshotUsers.data()['activo']) {
                foundUser = true;
                return this._loginService.login(docSnapshotUsers.data()['email'], this.userLogin.value.password);
              }
            }
          }
          if (!foundUser) {
            const foundDoc = addUsersquerySnapshot.docs.find(
              (doc) =>
                doc.data()['username'].toLowerCase() === username.toLowerCase() &&
                doc.data()['client'].toLowerCase() === client.toLowerCase() &&
                doc.data()['password'] === password
            );
            console.log(foundDoc);
            if (foundDoc) {
              this._loginService.loading = true;
              createUserWithEmailAndPassword(this.afAuth, foundDoc.data()['email'], password)
                .then(async (user) => {
                  this.router.navigate(['/portal']);
                  const uid = this.afAuth.currentUser?.uid;
                  const authData = {
                    authID: uid,
                  };
                  const docInstance = doc(dbInstance,clientDoc.id);
                  updateDoc(docInstance, { [`users`]: arrayUnion(uid)});

                  const querySnapshot = await getDocs(query(dbInstanceUsers, 
                      where('email', '==', foundDoc.data()['email'].toLowerCase()), 
                      where('username', '==', foundDoc.data()['username'].toLowerCase()), 
                      where('client', '==', client)
                  ));
                  console.log(querySnapshot)

                  let docInstanceUser;

                  
                  if (!querySnapshot.empty) {
                    docInstanceUser = querySnapshot.docs[0].ref;
                  }

                  if (docInstanceUser) {
                    await updateDoc(docInstanceUser, authData);
                  }

                  const deleteDocInstance = doc(addUsersInstance, foundDoc.id);
                  await deleteDoc(deleteDocInstance);

                  await this._loginService.login(foundDoc.data()['email'],password);
              });
            } else {
              this.toastr.error('No existe ese usuario en el cliente', 'Error');
            }
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
