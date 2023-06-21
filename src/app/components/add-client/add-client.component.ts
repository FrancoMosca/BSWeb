import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CRUDService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent{
  client: FormGroup;

  constructor(private fb: FormBuilder,
              public crud:CRUDService){
    this.client = this.fb.group({
      nombre:['',[Validators.required]],
      telefono:['',[Validators.required]],
      email:['',[Validators.required,Validators.email]],
      direccion:['',[Validators.required]],
    })
  }

}
