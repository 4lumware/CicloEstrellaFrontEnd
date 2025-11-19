import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  Input,
  InputSignal,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-profile-image-uploader',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatError],
  templateUrl: './profile-image-uploader.html',
  styleUrl: './profile-image-uploader.css',
})
export class ProfileImageUploader implements OnInit {
  public control: InputSignal<FormControl> = input.required<FormControl>();
  public maxFileSize = input<number>(5 * 1024 * 1024); // default max file size 5MB
  public label: InputSignal<string> = input<string>('Foto de perfil');
  protected errorMessage: WritableSignal<string> = signal<string>('');
  protected profileImagePreview: WritableSignal<string | null> = signal<string | null>(null);
  protected selectedFile: WritableSignal<File | null> = signal<File | null>(null);
  private destroyRef = inject(DestroyRef);
  // default max file size 5MB

  ngOnInit(): void {
    try {
      const image: string | null = this.control()?.value;
      if (image) {
        this.profileImagePreview.set(image);
      }
    } catch (e) {
      // ignore
    }
  }

  constructor() {
    effect(() => {
      const ctrl = this.control();
      if (!ctrl) return;

      merge(ctrl.statusChanges, ctrl.valueChanges)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.updateErrorMessage());
    });
  }
  updateErrorMessage(): void {
    const control = this.control();

    if (!control || !control.errors) {
      this.errorMessage.set('');
      return;
    }
    if (control.errors['fileSizeExceeded']) {
      this.errorMessage.set('La imagen debe ser menor a 5MB.');
      return;
    }

    if (control.errors['invalidType']) {
      this.errorMessage.set('Debe ser un archivo de imagen válido.');
      return;
    }

    this.errorMessage.set('');
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      this.setControlError('invalidType');
      return;
    }
    if (file.size > this.maxFileSize()) {
      this.setControlError('fileSizeExceeded');
      return;
    }

    this.clearControlError('fileSizeExceeded');
    this.clearControlError('invalidType');

    this.selectedFile.set(file);
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string | null;
      this.profileImagePreview.set(result);
      try {
        this.control().setValue(result);
        this.clearControlError('fileSizeExceeded');
      } catch (err) {
        // ignore
      }
    };
    reader.readAsDataURL(file);
  }

  protected removeImage(): void {
    this.selectedFile.set(null);
    this.profileImagePreview.set(null);
    try {
      this.control().setValue('');
      this.clearControlError('fileSizeExceeded');
      this.clearControlError('invalidType');
    } catch (e) {
      // ignore
    }
  }

  protected onPreviewError(): void {
    this.selectedFile.set(null);
    this.profileImagePreview.set(null);
    this.clearControlError('invalidType');
    this.clearControlError('fileSizeExceeded');
    try {
      this.control().setValue('');
    } catch (e) {
      // ignore
    }
  }

  private setControlError(key: string) {
    try {
      const errs = this.control().errors ? { ...(this.control().errors as any) } : {};
      errs[key] = true;
      this.control().setErrors(errs);
    } catch (e) {
      // ignore
    }
  }

  private clearControlError(key: string) {
    try {
      if (!this.control() || !this.control().errors) return;
      const errs = { ...(this.control().errors as any) };
      if (errs[key]) delete errs[key];
      const keys = Object.keys(errs);
      this.control().setErrors(keys.length ? errs : null);
    } catch (e) {
      // ignore
    }
  }
}
