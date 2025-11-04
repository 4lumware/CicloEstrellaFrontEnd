import { Component, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-authenticated-admin-header',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './authenticated-admin-header.component.html',
  styleUrl: './authenticated-admin-header.component.css',
})
export class AuthenticatedAdminHeaderComponent {
  onToggle = output<void>();

  onToggleSidenav() {
    this.onToggle.emit();
  }
}
