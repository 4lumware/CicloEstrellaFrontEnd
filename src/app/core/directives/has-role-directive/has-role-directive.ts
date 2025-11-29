import { Directive, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthUserService } from '../../services/users/auth/auth-user-service';
import { RolesService } from '../../services/roles/role-service';

@Directive({
  selector: '[hasRole]',
})
export class HasRoleDirective {
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
  private authService = inject(RolesService);
  public roles = input.required<string[]>({
    alias: 'hasRole',
  });

  ngOnInit() {}
}
