import { Component, inject, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { AuthUserService } from '../../../../core/services/users/auth/auth-user-service';
import { HasRoleDirective } from '../../../../core/directives/has-role-directive/has-role-directive';

interface MenuItem {
  path: string;
  icon: string;
  label: string;
  children?: MenuItem[];
  roles: string[];
}

@Component({
  selector: 'app-authenticated-admin-custom-sidenav',
  imports: [
    MatListModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    MatExpansionModule,
    MatListModule,
    MatButtonModule,
    RouterLink,
    HasRoleDirective,
  ],
  templateUrl: './authenticated-admin-custom-sidenav.html',
  styleUrl: './authenticated-admin-custom-sidenav.css',
})
export class AuthenticatedAdminCustomSidenav {
  private authService = inject(AuthUserService);
  items: WritableSignal<MenuItem[]> = signal<MenuItem[]>([
    {
      path: 'home',
      icon: 'dashboard',
      label: 'Dashboard',
      roles: ['ADMIN'],
    },
    {
      path: 'usuarios',
      icon: 'group',
      label: 'Usuarios',
      roles: ['ADMIN'],
    },
    {
      path: 'retroalimentacion',
      icon: 'rate_review',
      label: 'Retroalimentación',
      roles: ['ADMIN', 'MODERATOR'],
      children: [
        {
          path: 'comentarios',
          icon: 'comment',
          label: 'Comentarios',
          roles: ['ADMIN', 'MODERATOR'],
        },
        {
          path: 'reviews',
          icon: 'reviews',
          label: 'Reviews',
          roles: ['ADMIN', 'MODERATOR'],
        },
      ],
    },
    {
      path: 'profesores',
      icon: 'school',
      label: 'Profesores',
      roles: ['ADMIN', 'MODERATOR'],
      children: [
        {
          path: 'teacher-requests',
          icon: 'rate_review',
          label: 'Revisar',
          roles: ['ADMIN', 'MODERATOR'],
        },
        {
          path: 'profesores',
          icon: 'manage_accounts',
          label: 'Gestionar',
          roles: ['ADMIN'],
        },
      ],
    },
    {
      path: 'tramites',
      icon: 'assignment',
      label: 'Trámites',
      roles: ['ADMIN', 'MODERATOR', 'WRITER'],
    },
  ]);

  onLogout(): void {
    this.authService.logout();
  }
}
