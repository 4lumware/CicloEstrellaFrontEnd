import { Component, inject, OnInit, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthCurrentUserService } from '../../../../../core/services/users/auth/auth-current-user-service';
import { StudentModel, StudentModelUpdate } from '../../../../../core/models/students/student';
import { SnackbarNotificationService } from '../../../../../core/services/notifications/snackbar-notification-service';
import { Input } from '../../../../../shared/components/forms/input/input';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Option, Select } from '../../../../../shared/components/forms/select/select';
import { CareerService } from '../../../../../core/services/careers/career-service';
import { sign } from 'chart.js/helpers';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAnchor, MatButtonModule } from '@angular/material/button';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialogClose } from '@angular/material/dialog';
import { StudentService } from '../../../../../core/services/students/rest/student-service';
import { ApiResponse } from '../../../../../core/models/responses/response';

export interface StudentProfileUpdateFormValue {
  username: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  profilePictureUrl: FormControl<string>;
  currentSemester: FormControl<number>;
  careerIds: FormControl<number[]>;
}
@Component({
  selector: 'app-student-profile-basic',
  imports: [Input, ReactiveFormsModule, Select, MatChipsModule, MatIconModule, MatButtonModule],
  templateUrl: './student-profile-basic.html',
  styleUrl: './student-profile-basic.css',
})
export class StudentProfileBasic implements OnInit {
  protected onEditProfile = output<StudentModelUpdate & { studentId: number }>();
  protected onUpdatePasswordProfile = output<number>();
  private studentService = inject(StudentService);
  private careerService = inject(CareerService);
  protected student = signal<StudentModel | null>(null);
  private snackbarService = inject(SnackbarNotificationService);
  private fb = inject(NonNullableFormBuilder);
  protected formGroup!: FormGroup<StudentProfileUpdateFormValue>;
  protected careerOptions = signal<Option[]>([]);
  protected picturePreview = signal<string | null>(null);

  constructor() {
    this.formGroup = this.fb.group<StudentProfileUpdateFormValue>({
      username: this.fb.control(''),
      email: this.fb.control('', {
        validators: [Validators.email],
      }),
      password: this.fb.control(''),
      profilePictureUrl: this.fb.control(''),
      currentSemester: this.fb.control(1, {
        validators: [Validators.min(1), Validators.max(10)],
      }),
      careerIds: this.fb.control([]),
    });

    this.careerService.index().subscribe({
      next: (careers) => {
        this.careerOptions.set(careers);
      },
      error: (error) => {
        this.snackbarService.error('Error al cargar las carreras.');
        console.error('Error loading careers:', error);
      },
    });

    this.loadStudent();
  }

  ngOnInit(): void {
    this.formGroup.valueChanges.subscribe((value) => {
      console.log('Formulario actualizado:', value);
    });
  }

  onSubmit(): void {
    if (!this.formGroup.valid) return;
    const student = this.formGroup.value;
    this.onEditProfile.emit({
      username: student.username ?? '',
      email: student.email ?? '',
      profilePictureUrl: student.profilePictureUrl,
      currentSemester: student.currentSemester ?? 1,
      careerIds: student.careerIds ?? [],
      studentId: this.student()?.id!,
    });
  }

  loadStudent(): void {
    this.studentService.me().subscribe({
      next: (response: ApiResponse<StudentModel>) => {
        this.student.set(response.data);
        this.picturePreview.set(this.student()?.profilePictureUrl ?? null);
        this.formGroup.setValue({
          username: this.student()?.username ?? '',
          email: this.student()?.email ?? '',
          password: '',
          profilePictureUrl: this.student()?.profilePictureUrl ?? '',
          currentSemester: this.student()?.currentSemester ?? 1,
          careerIds: this.student()?.careers.map((career) => career.id) ?? [],
        });
      },
      error: (error) => {
        this.snackbarService.error('Error al cargar el perfil del estudiante.');
        console.error('Error loading student profile:', error);
      },
    });
  }

  onUpdatePassword(): void {
    this.onUpdatePasswordProfile.emit(this.student()?.id!);
  }

  onProfilePictureSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.formGroup.controls.profilePictureUrl.setValue(e.target.result);
        this.picturePreview.set(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  openFileSelector(fileInput: HTMLInputElement): void {
    fileInput.click();
  }
}
