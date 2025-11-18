import { Component, inject, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Route, Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';

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
  ],
  templateUrl: './authenticated-admin-custom-sidenav.html',
  styleUrl: './authenticated-admin-custom-sidenav.css',
})
export class AuthenticatedAdminCustomSidenav {
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
      path: 'comentarios',
      icon: 'comment',
      label: 'Comentarios',
    },
    {
      path: 'profesores',
      icon: 'school',
      label: 'Profesores',
      children: [
        {
          path: 'revisar',
          icon: 'rate_review',
          label: 'Revisar',
        },
        {
          path: 'gestionar',
          icon: 'manage_accounts',
          label: 'Gestionar',
        },
      ],
    },
  ]);
}
