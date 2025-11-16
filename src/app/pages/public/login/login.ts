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

  protected loading: WritableSignal<boolean> = signal<boolean>(false);
  protected loginError: WritableSignal<string> = signal<string>('');

  private fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private router: Router = inject(Router);
  private authService = inject(AuthUserService);

  constructor() {
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
        console.log('✅ Login exitoso:', response);
        const tokens = response.data.tokens;
        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);

        if (!('roles' in response.data.user) || !response.data.user.roles) {
          this.router.navigate(['/private/home']);
          return;
        }

        if (
          response.data.user.roles.some(
            (role) => role.roleName === 'ADMIN' || role.roleName === 'STAFF'
          )
        ) {
          this.router.navigate(['/dashboard/home']);
        }
      },
      error: (err) => {
        console.error('❌ Error en login:', err);
        this.loginError.set('Correo o contraseña incorrectos');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }
}
