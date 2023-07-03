import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from '../services/user.service';

@Directive({
  selector: '[appRole]'
})
export class RoleDirective implements OnInit  {
  @Input('appRole') roleName!: string;
  constructor(
    private _userService: UserService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  ngOnInit(): void {
    this._userService.getUserData().then(user => {
      const role = user?.role || ''; // Obtener el valor del 'role' del usuario
      if (role === this.roleName) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
  
  

}
