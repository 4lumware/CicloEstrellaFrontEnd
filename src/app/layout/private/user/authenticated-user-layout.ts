import { Component, inject } from '@angular/core';
import { HeaderComponent } from './authenticated-user-header/header.component';
import { RouterOutlet } from '@angular/router';
import { AuthUserService } from '../../../core/services/users/auth/auth-user-service';

@Component({
  selector: 'app-user',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './authenticated-user-layout.html',
  styleUrl: './authenticated-user-layout.css',
})
export class AuthenticatedUserLayout {
  private authService = inject(AuthUserService);

  protected currentUser$ = this.authService.currentUser$;

  constructor() {
    console.log('AuthenticatedUserLayout initialized');
    console.log('Current User Observable:', this.currentUser$);
  }
}
