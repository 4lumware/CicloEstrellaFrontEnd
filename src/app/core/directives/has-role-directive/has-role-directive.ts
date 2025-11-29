import { Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthUserService } from '../../services/users/auth/auth-user-service';
import { RolesService } from '../../services/roles/role-service';
import { AuthCurrentUserService } from '../../services/users/auth/auth-current-user-service';

@Directive({
  selector: '[hasRole]',
})
export class HasRoleDirective {
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
  private authService = inject(AuthCurrentUserService);
  private rolesService = inject(RolesService);
  public roles = input.required<string[]>({
    alias: 'hasRole',
  });

  constructor() {
    effect(() => {
      this.authService.initialize().subscribe((user) => {
        if (!user) {
          this.viewContainerRef.clear();
          return;
        }

        const roles = this.roles();
        this.rolesService.hasRole(user.id, roles).subscribe((response) => {
          const hasRole = response.data.hasRole;
          if (hasRole) {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
          } else {
            this.viewContainerRef.clear();
          }
        });
      });
    });
  }
}
