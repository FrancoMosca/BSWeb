import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent{
  client: FormGroup;

  constructor(private fb: FormBuilder,
              public _clientService: ClientService){
    this.client = this.fb.group({
      nombre:['',[Validators.required]],
      telefono:['',[Validators.required]],
      email:['',[Validators.required,Validators.email]],
      direccion:['',[Validators.required]],
    })
  }

}
