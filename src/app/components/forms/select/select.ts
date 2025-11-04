import { TitleCasePipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  InputSignal,
  signal,
  Type,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { merge } from 'rxjs';

export interface Option {
  label: string;
  value: any;
}

type InputType = {
  value: 'outline' | 'fill';
};

@Component({
  selector: 'app-select',
  imports: [MatFormFieldModule, MatSelectModule, ReactiveFormsModule, TitleCasePipe],
  templateUrl: './select.html',
  styleUrl: './select.css',
})
export class Select {
  id: InputSignal<string> = input.required<string>();
  control: InputSignal<FormControl> = input.required<FormControl>();
  label: InputSignal<string> = input.required<string>();
  options: InputSignal<Option[]> = input.required<Option[]>();
  variant: InputSignal<InputType['value']> = input<InputType['value']>('outline');
  multiple = input<boolean>(false);

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
