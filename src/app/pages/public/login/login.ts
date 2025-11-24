import { Component, inject, signal, WritableSignal } from '@angular/core';
import { HeaderAuth } from '../../../layout/header-auth/header-auth';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButton } from '@angular/material/button';

import { ApiResponse } from '../../../core/models/responses/response';
import {
  AuthUserService,
  JsonResponseDTO,
} from '../../../core/services/users/auth/auth-user-service';
import { Input } from '../../../shared/components/forms/input/input';
import { StaffModel } from '../../../core/models/staffs/staff';
import { StudentModel } from '../../../core/models/students/student';
import { SnackbarNotificationService } from '../../../core/services/notifications/snackbar-notification-service';
import { AuthCurrentUserService } from '../../../core/services/users/auth/auth-current-user-service';

export interface LoginFormValue {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderAuth, RouterLink, ReactiveFormsModule, MatButton, Input],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  protected loginForm: FormGroup<LoginFormValue>;
  private snackbar = inject(SnackbarNotificationService);
  protected loading: WritableSignal<boolean> = signal<boolean>(false);
  protected loginError: WritableSignal<string> = signal<string>('');

  private fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private router: Router = inject(Router);
  private authService = inject(AuthUserService);
  private authCurrentUserService = inject(AuthCurrentUserService);

  constructor() {
    this.authService.logout();
    this.loginForm = this.fb.group<LoginFormValue>({
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
      }),
      password: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
    });
  }

  onSubmit() {
    this.loading.set(true);
    this.loginError.set('');

    const { email, password } = this.loginForm.value;

    if (!email || !password) {
      this.loginError.set('Por favor complete todos los campos');
      this.loading.set(false);
      return;
    }

    this.authService.login<StaffModel | StudentModel>(email, password).subscribe({
      next: (response: ApiResponse<JsonResponseDTO<StaffModel | StudentModel>>) => {
        const user = response.data.user;

        if (!('roles' in user)) {
          this.router.navigate(['/private/home']);
          localStorage.setItem('user_role', 'STUDENT');
          this.authCurrentUserService.setCurrentUser(user);
          return;
        }

        if (user.roles.some((role) => role.roleName === 'ADMIN' || role.roleName === 'STAFF')) {
          this.router.navigate(['/dashboard/home']);
          localStorage.setItem('user_role', 'STAFF');
          this.authCurrentUserService.setCurrentUser(user);
          console.log('✅ Usuario con rol ADMIN o STAFF, redirigiendo a /dashboard/home');
        }
      },
      error: (err) => {
        console.error('❌ Error en login:', err);
        this.loginError.set('Correo o contraseña incorrectos');
        this.snackbar.error('Error al iniciar sesión. Por favor, verifique sus credenciales.');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }
}
