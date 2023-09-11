import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { FirebaseCodeErrorService } from './firebase-code-error.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  isLoggedIn: boolean = false;
  loading: boolean = false;
  systemUser = false;
  client!: string;

  constructor(
    private router: Router,
    private afAuth: Auth,
    private toastr: ToastrService,
    private firebaseError: FirebaseCodeErrorService,
    private _userService:UserService
  ) {}

  async login(email: any, password: any) {
    this.loading = true;
    signInWithEmailAndPassword(this.afAuth, email, password).then(async () => {
      this.isLoggedIn = true;
      this.toastr.clear();
      this.toastr.success('Has iniciado sesión con éxito', 'Inicio de sesión');
      await this._userService.getUserData();
      this.isLoggedIn = false;
      this.router.navigate(['/portal']);
    }).catch((error: any) => {
      this.loading = false;
      this.toastr.error(this.firebaseError.codeError(error.code), 'Error');
    });
  }

  logout() {
    signOut(this.afAuth).then(() => this.router.navigate(['/login']));
    this.isLoggedIn = false;
    this.loading = false;
  }

}
