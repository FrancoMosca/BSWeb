import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CRUDService } from '../../services/crud.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
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
  }
}
