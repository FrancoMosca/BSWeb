import { Component, OnInit } from '@angular/core';
import { CRUDService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-crud-clientes',
  templateUrl: './crud-clientes.component.html',
  styleUrls: ['./crud-clientes.component.scss']
})
export class CrudClientesComponent implements OnInit {
  public clients: string[] = [];

  constructor(public _crudService:CRUDService){
  }

  ngOnInit(): void {
    this._crudService.getClients().then((clientesArray) => {
      this.clients = clientesArray;
      console.log(this.clients);
    });
  }

}
