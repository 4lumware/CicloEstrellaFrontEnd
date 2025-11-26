import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { Inject } from '@angular/core';
import { Input } from '../../../../../../../shared/components/forms/input/input';
import { Select, Option } from '../../../../../../../shared/components/forms/select/select';
import { ProfileImageUploader } from '../../../../../../../shared/components/forms/profile-image-uploader/profile-image-uploader';
import { CareerService } from '../../../../../../../core/services/careers/career-service';
import { CourseService } from '../../../../../../../core/services/courses/courses-service';
import { CampusService } from '../../../../../../../core/services/campuses/campuses-service';
import { ImageService } from '../../../../../../../core/services/images/image-service';

export interface TeacherUpdateFormValue {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  generalDescription: FormControl<string>;
  profilePictureUrl: FormControl<Blob | null>;
  careerIds: FormControl<number[]>;
  campusIds: FormControl<number[]>;
  courseIds: FormControl<number[]>;
}

@Component({
  selector: 'app-teacher-update-dialog',
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
  templateUrl: './teacher-update-dialog.html',
  styleUrl: './teacher-update-dialog.css',
})
export class TeacherUpdateDialog implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  protected form: FormGroup<TeacherUpdateFormValue>;
  private dialogRef = inject(MatDialogRef<TeacherUpdateDialog, any>);
  protected data = inject(MAT_DIALOG_DATA) as any;
  private careerService = inject(CareerService);
  private courseService = inject(CourseService);
  private campusService = inject(CampusService);
  private imageService = inject(ImageService);
  protected imagePreview = signal<Blob | null>(null);
  protected careerOptions = signal<Option[]>([]);
  protected courseOptions = signal<Option[]>([]);
  protected campusOptions = signal<Option[]>([]);

  constructor() {
    this.form = this.fb.group<TeacherUpdateFormValue>({
      firstName: this.fb.control('', { validators: [Validators.required] }),
      lastName: this.fb.control('', { validators: [Validators.required] }),
      generalDescription: this.fb.control(''),
      profilePictureUrl: this.fb.control<Blob | null>(null),
      careerIds: this.fb.control<number[]>([]),
      campusIds: this.fb.control<number[]>([]),
      courseIds: this.fb.control<number[]>([]),
    });

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

  async ngOnInit(): Promise<void> {
    const t = this.data?.teacher;

    if (t) {
      console.log('Teacher data:', t);
      this.form.patchValue({
        firstName: t.firstName || '',
        lastName: t.lastName || '',
        generalDescription: t.generalDescription || '',
        profilePictureUrl: t.profilePictureUrl || null,
        careerIds: (t.careers || []).map((c: any) => c.id),
        campusIds: (t.campuses || []).map((c: any) => c.id),
        courseIds: (t.courses || []).map((c: any) => c.id),
      });

      if (t.profilePictureUrl) this.form.controls.profilePictureUrl.setValue(t.profilePictureUrl);
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onSubmit() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();

    const payload: any = {
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
