import { Component, inject, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Route, Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

interface MenuItem {
  path: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-authenticated-admin-custom-sidenav',
  imports: [MatListModule, MatIconModule, RouterLink, RouterLinkActive],
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
      path: 'gestion',
      icon: 'settings',
      label: 'Gestión',
    },
    {
      path: 'solicitudes',
      icon: 'assignment',
      label: 'Solicitudes',
    },
  ]);
}
