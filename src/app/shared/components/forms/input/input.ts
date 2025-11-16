import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  InputSignal,
  OnInit,
  runInInjectionContext,
  signal,
  WritableSignal,
  computed,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { merge } from 'rxjs';

type InputType = {
  value: 'outline' | 'fill';
};

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatError,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './input.html',
  styleUrl: './input.css',
})
export class Input {
  private destroyRef = inject(DestroyRef);

  public id: InputSignal<string> = input.required<string>();
  public control: InputSignal<FormControl> = input.required<FormControl>();
  public label: InputSignal<string> = input.required<string>();
  public type: InputSignal<string> = input<string>('text');
  public variant: InputSignal<InputType['value']> = input<InputType['value']>('outline');
  public placeholder: InputSignal<string> = input('');

  protected errorMessage: WritableSignal<string> = signal<string>('');
  protected showPassword = signal(false);

  protected inputType = computed(() => {
    const t = this.type();
    if (t === 'password') return this.showPassword() ? 'text' : 'password';
    return t || 'text';
  });

  constructor() {
    effect(() => {
      const ctrl = this.control();
      if (!ctrl) return;

      merge(ctrl.statusChanges, ctrl.valueChanges)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.updateErrorMessage());
    });
  }

  protected updateErrorMessage() {
    const control = this.control();

    if (!control || !control.errors) {
      this.errorMessage.set('');
      return;
    }

    if (control.errors['required']) {
      this.errorMessage.set(`${this.label()} es obligatorio`);
      return;
    }

    if (control.errors['minlength']) {
      this.errorMessage.set(`Mínimo ${control.errors['minlength'].requiredLength} caracteres`);
      return;
    }

    if (control.errors['maxlength']) {
      this.errorMessage.set(`Máximo ${control.errors['maxlength'].requiredLength} caracteres`);
      return;
    }

    if (control.errors['email']) {
      this.errorMessage.set(`Ingrese un email válido`);
      return;
    }

    this.errorMessage.set('Campo inválido');
  }
}
