import { Component } from '@angular/core';
import { CRUDService } from 'src/app/services/crud.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-crud-usuarios',
  templateUrl: './crud-usuarios.component.html',
  styleUrls: ['./crud-usuarios.component.css']
})
export class CrudUsuariosComponent {
  public users : any[]=[]
  constructor(public _modalService:ModalService,
              public _crudService:CRUDService){
                this._crudService.getUsers().then((usersArray) => {
                  this.users = usersArray;
                });
              }

}
