import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CRUDService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent {
  client: FormGroup;
  loading:boolean =false;

  constructor(private router:Router,
              private fb: FormBuilder,
              private crud:CRUDService){
    this.client = this.fb.group({
      client:['',[Validators.required]]
    })
  }
  addClient(){
    const client = this.client.value.client;
    this.crud.addClient(client);
    this.loading =true;
  }
}
