import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from 'src/app/services/client.service';
import { RolesService } from 'src/app/services/roles.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  public user: FormGroup;
  public loading: boolean = false;
  public loggedUserClient!: string;
  constructor(
              private fb:FormBuilder,
              public _clientService:ClientService,
              public _rolesService:RolesService,
              public _userService:UserService)
              {
                  this.user = this.fb.group({
                    username:['',[Validators.required]],
                    email:['',[Validators.required,Validators.email]],
                    password:['',[Validators.required, Validators.minLength(6)]],
                    repeatPassword:['',Validators.required],
                    client:['',Validators.required],
                    userRole:['',[Validators.required]]
                  });
              }


  async ngOnInit(): Promise<void> {
    const user = await this._userService.getUserData();
    this.loggedUserClient = user?.client || '';
    if (!this.systemClient()) {
      this.user.patchValue({
        client: this.loggedUserClient
      });
    }
  }
  
  systemClient(): Boolean{
    if(this.loggedUserClient.toLowerCase() === 'sistema'){
      return true;
    }else{
      return false;
    };
  }
}