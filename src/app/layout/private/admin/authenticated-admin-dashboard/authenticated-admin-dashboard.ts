import { Component, effect, signal, WritableSignal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { AuthenticatedAdminHeaderComponent } from '../authenticated-admin-header/authenticated-admin-header.component';
import { AuthenticatedAdminCustomSidenav } from '../authenticated-admin-custom-sidenav/authenticated-admin-custom-sidenav';
@Component({
  selector: 'app-authenticated-admin-dashboard',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    AuthenticatedAdminHeaderComponent,
    AuthenticatedAdminCustomSidenav,
  ],
  templateUrl: './authenticated-admin-dashboard.html',
  styleUrl: './authenticated-admin-dashboard.css',
})
export class AuthenticatedAdminDashboard {
  collapsed: WritableSignal<boolean> = signal<boolean>(false);

  constructor() {
    effect(() => {
      console.log('Sidenav collapsed state:', this.collapsed());
    });
  }
}
