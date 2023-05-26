import { Component, OnInit } from '@angular/core';
import { CRUDService } from 'src/app/services/crud.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-client-box',
  templateUrl: './client-box.component.html',
  styleUrls: ['./client-box.component.css']
})
export class ClientBoxComponent implements OnInit{
  public clients: any[] = [];
  constructor(public _crudService:CRUDService,
              public _modalService:ModalService){}

  ngOnInit(): void {
    this._crudService.getClients().then((clientesArray) => {
      this.clients = clientesArray;
    });
  }

}
