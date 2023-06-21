import { RoleDirective } from './role.directive';
import { LoginService } from '../services/login.service';
import { TemplateRef, ViewContainerRef } from '@angular/core';

describe('RoleDirective', () => {
  it('should create an instance', () => {
    const loginServiceStub = {} as LoginService;
    const templateRefStub = {} as TemplateRef<any>;
    const viewContainerStub = {} as ViewContainerRef;
    const directive = new RoleDirective(loginServiceStub, templateRefStub, viewContainerStub);
    expect(directive).toBeTruthy();
  });
});

