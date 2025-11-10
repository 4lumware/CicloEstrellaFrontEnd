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
  ViewChild,
  ElementRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule, MatSelect } from '@angular/material/select';
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
  panel: InputSignal<'up' | 'down'> = input<'up' | 'down'>('down');

  @ViewChild(MatSelect, { static: true }) matSelect?: MatSelect;
  private host = inject(ElementRef<HTMLElement>);

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

  private repositionOverlayAbove() {
    try {
      const panels = Array.from(
        document.querySelectorAll('.mat-select-panel.select-up')
      ) as HTMLElement[];
      if (!panels || panels.length === 0) return;
      const panel = panels[panels.length - 1];
      const overlayPane = panel.closest('.cdk-overlay-pane') as HTMLElement | null;
      if (!overlayPane) return;

      const hostEl = this.host?.nativeElement as HTMLElement | null;
      if (!hostEl) return;
      const trigger = hostEl.querySelector('.mat-select-trigger') as HTMLElement | null;
      if (!trigger) return;

      const triggerRect = trigger.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();

      const top = Math.max(0, triggerRect.top - panelRect.height - 8);
      const left = triggerRect.left;

      overlayPane.style.position = 'fixed';
      overlayPane.style.top = `${top}px`;
      overlayPane.style.left = `${left}px`;
      overlayPane.style.transform = 'none';
    } catch (e) {
      // ignore
    }
  }

  private repositionOverlayBelow() {
    try {
      const panels = Array.from(
        document.querySelectorAll('.mat-select-panel.select-down')
      ) as HTMLElement[];
      if (!panels || panels.length === 0) return;
      const panel = panels[panels.length - 1];
      const overlayPane = panel.closest('.cdk-overlay-pane') as HTMLElement | null;
      if (!overlayPane) return;

      const hostEl = this.host?.nativeElement as HTMLElement | null;
      if (!hostEl) return;
      const trigger = hostEl.querySelector('.mat-select-trigger') as HTMLElement | null;
      if (!trigger) return;

      const triggerRect = trigger.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();

      // compute top so the panel sits below the trigger
      const top = Math.min(window.innerHeight - panelRect.height, triggerRect.bottom + 8);
      const left = triggerRect.left;

      overlayPane.style.position = 'fixed';
      overlayPane.style.top = `${top}px`;
      overlayPane.style.left = `${left}px`;
      overlayPane.style.transform = 'none';
    } catch (e) {
      // ignore
    }
  }
}
