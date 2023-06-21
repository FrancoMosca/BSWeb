import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FirestoreService } from 'src/app/services/firestore.service';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.css']
})
export class ModifyComponent implements OnInit{
  @Input() dato!: string;
  public client:any;
  public user:any;
  
  constructor(
    private _firestoreService: FirestoreService,
    private toastr: ToastrService,
    public _rolesService: RolesService,
  ) {
    this.dato = history.state.dato;
  }
  
  ngOnInit() {
    this.user = history.state.user;
    this.client = history.state.client;
  }

  async modifyUser(user: any) {
    const collectionName = 'Users';
    const documentId = user.id;
    try {
      await this._firestoreService.updateDocument(collectionName, documentId, user);
      this.toastr.success('El usuario ha sido modificado', 'Acción exitosa');
    } catch (error) {
      this.toastr.error('No se pudo modificar el usuario', 'Error');
    }
  }

  async modifyClient(client: any) {
    const collectionName = 'Clientes';
    const documentId = client.id;
  
    try {
      await this._firestoreService.updateDocument(collectionName, documentId, client);
      this.toastr.success('El cliente ha sido modificado', 'Acción exitosa');
    } catch (error) {
      console.error('Error modifying client:', error);
      this.toastr.error('No se pudo modificar el cliente', 'Error');
    }
  }

  isFieldReadonly(field: string): boolean {
    if (field === 'authID' || field ==='id') {
      return true;
    } else {
      return false;
    }
  }

  isBooleanField(obj:any,field: string): boolean {
    return typeof obj[field] === 'boolean';
  }

  isFieldArray(obj:any,field: string): boolean {
    return Array.isArray(obj[field]);
  }

  getObjectKeys(obj: any): string[] {
    if(obj['authID']){
      return Object.keys(obj).filter(key => key !== 'id');
    }else{
      return Object.keys(obj);
    }
  }

  getSortedFields(obj: any): string[] {
    const fieldOrder = obj.fieldOrder || []; // Obtener el orden de los campos desde el modelo de datos
    const objFields = this.getObjectKeys(obj);
  
    return objFields.sort((a, b) => {
      const indexA = fieldOrder.indexOf(a);
      const indexB = fieldOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) {
        return a.localeCompare(b); // Si ambos campos no están en el orden, se ordenan alfabéticamente
      } else if (indexA === -1) {
        return 1; // Si solo el campo A no está en el orden, se coloca después de B
      } else if (indexB === -1) {
        return -1; // Si solo el campo B no está en el orden, se coloca después de A
      }
  
      return indexA - indexB; // Si ambos campos están en el orden, se utiliza su posición en el orden
    });
  }
  
}
