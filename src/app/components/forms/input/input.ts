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
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { merge } from 'rxjs';

@Component({
  selector: 'app-input',
  imports: [MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatError],
  templateUrl: './input.html',
  styleUrl: './input.css',
})
export class Input {
  id: InputSignal<string> = input.required<string>();
  control: InputSignal<FormControl> = input.required<FormControl>();
  label: InputSignal<string> = input.required<string>();
  type = input('text');
  placeholder = input('');
  errorMessage = signal('');
  private destroyRef = inject(DestroyRef);

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
