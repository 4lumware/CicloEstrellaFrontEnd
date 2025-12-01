import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormControl,
  NonNullableFormBuilder,
  FormGroup,
} from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';

export interface FormalityCreateFormValue {
  title: FormControl<string>;
  description: FormControl<string>;
  startDate: FormControl<Date | null>;
  endDate: FormControl<Date | null>;
}

@Component({
  selector: 'app-formality-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    CdkTextareaAutosize,
    MatDatepickerModule,
  ],
  templateUrl: './formality-create-dialog.html',
  styleUrls: ['./formality-create-dialog.css'],
})
export class FormalityCreateDialog {
  private fb = inject(NonNullableFormBuilder);
  private dialogRef = inject(MatDialogRef<FormalityCreateDialog>);
  protected formGroup!: FormGroup<FormalityCreateFormValue>;
  constructor() {
    this.formGroup = this.fb.group<FormalityCreateFormValue>({
      title: this.fb.control('', { validators: [Validators.required] }),
      description: this.fb.control('', {
        validators: [Validators.required, Validators.maxLength(1000)],
      }),
      startDate: this.fb.control(null, { validators: [Validators.required] }),
      endDate: this.fb.control(null, { validators: [Validators.required] }),
    });
  }

  submit(): void {
    if (this.formGroup.invalid) return;
    const payload = this.formGroup.value;
    this.dialogRef.close(payload);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
