import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { CRUDService } from 'src/app/services/crud.service';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  user: FormGroup;
  loading: boolean = false;
  constructor(
              private fb:FormBuilder,
              public _crudService:CRUDService,
              public _clientService:ClientService,
              public _rolesService:RolesService){
    this.user = this.fb.group({
      username:['',[Validators.required]],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required, Validators.minLength(6)]],
      repeatPassword:['',Validators.required],
      client:['',[Validators.required]],
      userRole:['',[Validators.required]]
    });
  }
}