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
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Inject } from '@angular/core';
import { FormalityModel } from '../../../../../../../core/models/formalities/formality';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';

export interface FormalityUpdateFormValue {
  title: FormControl<string>;
  description: FormControl<string>;
  startDate: FormControl<Date | null>;
  endDate: FormControl<Date | null>;
}

@Component({
  selector: 'app-formality-update-dialog',
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
  templateUrl: './formality-update-dialog.html',
  styleUrls: ['./formality-update-dialog.css'],
})
export class FormalityUpdateDialog {
  private fb = inject(NonNullableFormBuilder);
  private dialogRef = inject(MatDialogRef<FormalityUpdateDialog>);
  private data = inject(MAT_DIALOG_DATA) as { item: FormalityModel };
  protected formGroup!: FormGroup<FormalityUpdateFormValue>;

  constructor() {
    this.formGroup = this.fb.group<FormalityUpdateFormValue>({
      title: this.fb.control(this.data.item.title, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      description: this.fb.control(this.data.item.description, {
        validators: [Validators.required, Validators.maxLength(1000)],
      }),
      startDate: this.fb.control(this.data.item.startDate, {
        validators: [Validators.required],
      }),
      endDate: this.fb.control(this.data.item.endDate, {
        validators: [Validators.required],
      }),
    });
  }

  submit(): void {
    if (this.formGroup.invalid) return;
    const payload: any = {
      idFormality: this.data.item.idFormality,
      ...this.formGroup.value,
    };
    this.dialogRef.close(payload);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
