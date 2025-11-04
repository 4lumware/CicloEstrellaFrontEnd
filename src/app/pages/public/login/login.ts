import { Component, inject, signal } from '@angular/core';
import { HeaderAuth } from '../../../layout/header-auth/header-auth';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatLabel } from '@angular/material/form-field';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiResponse } from '../../../services/careers/career-service';
import { AuthUserService, JsonResponseDTO } from '../../../services/users/auth/auth-user-service';

@Component({
  selector: 'app-login',
  imports: [
    HeaderAuth,
    RouterLink,
    MatFormField,
    ReactiveFormsModule,
    MatLabel,
    MatError,
    MatInput,
    MatIconButton,
    MatIcon,
    MatButton,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  hidePassword = true;

  emailError = signal('');
  passwordError = signal('');
  loading = signal(false);
  loginError = signal('');

  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private authService = inject(AuthUserService);
  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    merge(
      this.loginForm.get('email')!.statusChanges,
      this.loginForm.get('email')!.valueChanges,
      this.loginForm.get('password')!.statusChanges,
      this.loginForm.get('password')!.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessages());
  }

  updateErrorMessages() {
    const emailCtrl = this.loginForm.get('email');
    const passCtrl = this.loginForm.get('password');

    if (emailCtrl?.hasError('required')) {
      this.emailError.set('El correo es obligatorio');
    } else if (emailCtrl?.hasError('email')) {
      this.emailError.set('Ingresa un correo válido');
    } else {
      this.emailError.set('');
    }

    if (passCtrl?.hasError('required')) {
      this.passwordError.set('La contraseña es obligatoria');
    } else {
      this.passwordError.set('');
    }
  }

  /** Acción al enviar formulario */
  onSubmit() {
    if (!this.loginForm.valid) {
      this.updateErrorMessages();
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.loginError.set('');

    const { email, password } = this.loginForm.value;

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
