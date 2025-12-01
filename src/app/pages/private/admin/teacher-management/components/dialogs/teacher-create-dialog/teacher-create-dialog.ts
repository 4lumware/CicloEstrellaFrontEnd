import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { Input } from '../../../../../../../shared/components/forms/input/input';
import { Select, Option } from '../../../../../../../shared/components/forms/select/select';
import { ProfileImageUploader } from '../../../../../../../shared/components/forms/profile-image-uploader/profile-image-uploader';
import { CareerService } from '../../../../../../../core/services/careers/career-service';
import { CourseService } from '../../../../../../../core/services/courses/courses-service';
import { CampusService } from '../../../../../../../core/services/campuses/campuses-service';
import { TeacherModelCreate } from '../../../../../../../core/models/teachers/teacher';

export interface TeacherCreateFormValue {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  generalDescription: FormControl<string>;
  profilePictureUrl: FormControl<string>;
  careerIds: FormControl<number[]>;
  campusIds: FormControl<number[]>;
  courseIds: FormControl<number[]>;
}

@Component({
  selector: 'app-teacher-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    Input,
    Select,
    ProfileImageUploader,
  ],
  templateUrl: './teacher-create-dialog.html',
  styleUrl: './teacher-create-dialog.css',
})
export class TeacherCreateDialog {
  private fb = inject(NonNullableFormBuilder);
  protected form: FormGroup<TeacherCreateFormValue>;
  private dialogRef = inject(MatDialogRef<TeacherCreateDialog, any>);
  // image upload is handled by ProfileImageUploader component bound to the form control
  private careerService = inject(CareerService);
  private courseService = inject(CourseService);
  private campusService = inject(CampusService);

  protected careerOptions = signal<Option[]>([]);
  protected courseOptions = signal<Option[]>([]);
  protected campusOptions = signal<Option[]>([]);

  constructor() {
    this.form = this.fb.group<TeacherCreateFormValue>({
      firstName: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      lastName: this.fb.control('', { validators: [Validators.required, Validators.minLength(2)] }),
      generalDescription: this.fb.control('', {
        validators: [Validators.required],
      }),
      profilePictureUrl: this.fb.control('', {
        validators: [Validators.required],
      }),
      careerIds: this.fb.control<number[]>([], {
        validators: [Validators.required],
      }),
      campusIds: this.fb.control<number[]>([], {
        validators: [Validators.required],
      }),
      courseIds: this.fb.control<number[]>([], {
        validators: [Validators.required],
      }),
    });

    // load select options
    this.careerService.index().subscribe({ next: (opts) => this.careerOptions.set(opts) });
    this.courseService.index().subscribe({
      next: (resp) =>
        this.courseOptions.set(
          (resp.data || []).map((c: any) => ({ value: c.id, label: c.courseName }))
        ),
    });
    this.campusService.index().subscribe({
      next: (resp) =>
        this.campusOptions.set(
          (resp.data || []).map((c: any) => ({ value: c.id, label: c.campusName }))
        ),
    });
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const payload: TeacherModelCreate = {
      firstName: v.firstName,
      lastName: v.lastName,
      generalDescription: v.generalDescription,
      profilePictureUrl: v.profilePictureUrl,
      careerIds: v.careerIds ?? [],
      campusIds: v.campusIds ?? [],
      courseIds: v.courseIds ?? [],
    };
    this.dialogRef.close(payload);
  }
}
