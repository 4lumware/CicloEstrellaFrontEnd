import {Component, signal} from '@angular/core';
import {HeaderAuth} from '../../../layout/header-auth/header-auth';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {MatLabel} from '@angular/material/form-field';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {merge} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


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
    MatButton
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  hidePassword = true;

  // Mensajes de error como signals
  emailError = signal('');
  passwordError = signal('');

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Escucha cambios en los controles
    merge(
      this.loginForm.get('email')!.statusChanges,
      this.loginForm.get('email')!.valueChanges,
      this.loginForm.get('password')!.statusChanges,
      this.loginForm.get('password')!.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessages());
  }

  /** Actualiza los mensajes de error dinámicamente */
  updateErrorMessages() {
    const emailCtrl = this.loginForm.get('email');
    const passCtrl = this.loginForm.get('password');

    // Correo
    if (emailCtrl?.hasError('required')) {
      this.emailError.set('El correo es obligatorio');
    } else if (emailCtrl?.hasError('email')) {
      this.emailError.set('Ingresa un correo válido');
    } else {
      this.emailError.set('');
    }

    // Contraseña
    if (passCtrl?.hasError('required')) {
      this.passwordError.set('La contraseña es obligatoria');
    } else {
      this.passwordError.set('');
    }
  }

  /** Acción al enviar formulario */
  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Login data:', this.loginForm.value);
      // Aquí conectarías con el backend
      //this.router.navigate(['/dashboard']);
    } else {
      this.updateErrorMessages();
      this.loginForm.markAllAsTouched();
    }
  }
}
