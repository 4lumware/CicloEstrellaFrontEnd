import { Component, inject, signal, WritableSignal } from '@angular/core';
import { HeaderAuth } from '../../../layout/header-auth/header-auth';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatLabel } from '@angular/material/form-field';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiResponse } from '../../../services/careers/career-service';
import { AuthUserService, JsonResponseDTO } from '../../../services/users/auth/auth-user-service';
import { Input } from '../../../components/forms/input/input';

export interface LoginFormValue {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
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

    this.authService.login(email, password).subscribe({
      next: (response: ApiResponse<JsonResponseDTO>) => {
        console.log('✅ Login exitoso:', response);
        const tokens = response.data.tokens;
        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);

        if (response.data.user.roles === undefined) {
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
