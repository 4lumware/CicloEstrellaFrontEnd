import { Component, inject } from '@angular/core';
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
import { Input } from '../../../../../../shared/components/forms/input/input';
import { Select, Option } from '../../../../../../shared/components/forms/select/select';
import { ProfileImageUploader } from '../../../../../../shared/components/forms/profile-image-uploader/profile-image-uploader';
import { CareerService } from '../../../../../../core/services/careers/career-service';
import { CourseService } from '../../../../../../core/services/courses/courses-service';
import { CampusService } from '../../../../../../core/services/campuses/campuses-service';
import { TeacherModelCreate } from '../../../../../../core/models/teachers/teacher';
import { TeacherRequestService } from '../../../../../../core/services/teacher-requests/teacher-requests-service';
import { AuthCurrentUserService } from '../../../../../../core/services/users/auth/auth-current-user-service';
import { RequestModelCreate } from '../../../../../../core/models/requests/requests';

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
  selector: 'app-create-request-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    Input,
    Select,
    ProfileImageUploader,
  ],
  templateUrl: './create-request-dialog.component.html',
  styleUrls: ['./create-request-dialog.component.css'],
})
export class CreateRequestDialogComponent {
  private fb = inject(NonNullableFormBuilder);
  protected form: FormGroup<TeacherCreateFormValue>;
  private dialogRef = inject(MatDialogRef<CreateRequestDialogComponent, any>);
  private careerService = inject(CareerService);
  private courseService = inject(CourseService);
  private campusService = inject(CampusService);
  private srv = inject(TeacherRequestService);
  private currentUser = inject(AuthCurrentUserService);

  protected careerOptions = [] as Option[];
  protected courseOptions = [] as Option[];
  protected campusOptions = [] as Option[];

  constructor() {
    this.form = this.fb.group<TeacherCreateFormValue>({
      firstName: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      lastName: this.fb.control('', { validators: [Validators.required, Validators.minLength(2)] }),
      generalDescription: this.fb.control('', { validators: [Validators.required] }),
      profilePictureUrl: this.fb.control('', { validators: [Validators.required] }),
      careerIds: this.fb.control<number[]>([], { validators: [Validators.required] }),
      campusIds: this.fb.control<number[]>([], { validators: [Validators.required] }),
      courseIds: this.fb.control<number[]>([], { validators: [Validators.required] }),
    });

    this.careerService.index().subscribe({ next: (opts) => (this.careerOptions = opts) });
    this.courseService.index().subscribe({
      next: (resp) =>
        (this.courseOptions = (resp.data || []).map((c: any) => ({
          value: c.id,
          label: c.courseName,
        }))),
    });
    this.campusService.index().subscribe({
      next: (resp) =>
        (this.campusOptions = (resp.data || []).map((c: any) => ({
          value: c.id,
          label: c.campusName,
        }))),
    });
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const teacherCreate: TeacherModelCreate = {
      firstName: v.firstName,
      lastName: v.lastName,
      generalDescription: v.generalDescription,
      profilePictureUrl: v.profilePictureUrl,
      careerIds: v.careerIds ?? [],
      campusIds: v.campusIds ?? [],
      courseIds: v.courseIds ?? [],
    };

    const student = this.currentUser.currentUserValue as any;
    const payload: RequestModelCreate<TeacherModelCreate> = {
      requestType: 'TEACHER',
      content: teacherCreate,
    };

    // studentId must be provided by service endpoint path
    const studentId = (student?.id ?? '').toString();
    this.srv
      .create(studentId, payload)
      .subscribe({ next: (res) => this.dialogRef.close(res.data), error: () => {} });
  }
}
