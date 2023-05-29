import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddClientComponent } from '../components/add-client/add-client.component';
import { ModifyClientComponent } from '../components/modify-client/modify-client.component';
import { RegisterComponent } from '../components/register/register.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private _modalService: NgbModal) { }


  openAddClientModal() {
    const modalRef = this._modalService.open(AddClientComponent);
    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  openModifyClientModal(client:string) {
    const modalRef = this._modalService.open(ModifyClientComponent);
    modalRef.componentInstance.clientID=client;
    console.log(client);
    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  openAddUserModal() {
    const modalRef = this._modalService.open(RegisterComponent);
    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }
}
