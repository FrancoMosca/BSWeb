import { Component, OnInit } from '@angular/core';
import { CRUDService } from 'src/app/services/crud.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-crud-clientes',
  templateUrl: './crud-clientes.component.html',
  styleUrls: ['./crud-clientes.component.scss']
})


export class CrudClientesComponent {
  public clients: any[] = [];
  constructor(public _crudService:CRUDService,
              public _modalService:ModalService){}

}
