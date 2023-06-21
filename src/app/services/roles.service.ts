import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  roles =[
    {id:1, name:'Sistema'},
    {id:2, name:'Administrador'},
    {id:3, name:'Cliente'},
    {id:4, name:'Vendedor'},
    {id:5, name:'Proveedor'}
  ];
}
