import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CRUDService } from 'src/app/services/crud.service';


@Component({
  selector: 'app-modify-client',
  templateUrl: './modify-client.component.html',
  styleUrls: ['./modify-client.component.css']
})
export class ModifyClientComponent {
  client: FormGroup;
  loading:boolean =false;
  @Input()clientID!: string;
  constructor(private router:Router,
              private fb: FormBuilder,
              private crud:CRUDService){
    this.client = this.fb.group({
      newIdClient:['',[Validators.required]]
    })
  }

  async modifyClient(){
    const newIdClient = this.client.value.newIdClient;
    this.crud.modifyDoc(this.clientID,newIdClient);
    this.loading =true;
  }
}
