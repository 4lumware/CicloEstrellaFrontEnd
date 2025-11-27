import { Component, inject, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { AuthUserService } from '../../../../core/services/users/auth/auth-user-service';

interface MenuItem {
  path: string;
  icon: string;
  label: string;
  children?: MenuItem[];
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
    },
    {
      path: 'usuarios',
      icon: 'group',
      label: 'Usuarios',
    },
    {
      path: 'retroalimentacion',
      icon: 'rate_review',
      label: 'Retroalimentación',
      children: [
        {
          path: 'comentarios',
          icon: 'comment',
          label: 'Comentarios',
        },
        {
          path: 'reviews',
          icon: 'reviews',
          label: 'Reviews',
        },
      ],
    },
    {
      path: 'profesores',
      icon: 'school',
      label: 'Profesores',
      children: [
        {
          path: 'teacher-requests',
          icon: 'rate_review',
          label: 'Revisar',
        },
        {
          path: 'profesores',
          icon: 'manage_accounts',
          label: 'Gestionar',
        },
      ],
    },
    {
      path: 'tramites',
      icon: 'assignment',
      label: 'Trámites',
    },
  ]);

  onLogout(): void {
    this.authService.logout();
  }
}
