import { Component, inject, OnInit, output, Output, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAnchor, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Option, Select } from '../../../../../shared/components/forms/select/select';
import { Input } from '../../../../../shared/components/forms/input/input';
import { CareerService } from '../../../../../core/services/careers/career-service';
import { StudentService } from '../../../../../core/services/students/rest/student-service';
import {
  StudentModelCreate,
  StudentModelCreateRest,
} from '../../../../../core/models/students/student';
import { StudentAdapterRest } from '../../../../../core/adapters/students/StudentAdapterRest';
import { Router } from '@angular/router';

export const TERM_OPTIONS: Option[] = [
  { label: '1er Ciclo', value: 1 },
  { label: '2do Ciclo', value: 2 },
  { label: '3er Ciclo', value: 3 },
  { label: '4to Ciclo', value: 4 },
  { label: '5to Ciclo', value: 5 },
  { label: '6to Ciclo', value: 6 },
  { label: '7mo Ciclo', value: 7 },
  { label: '8vo Ciclo', value: 8 },
  { label: '9no Ciclo', value: 9 },
  { label: '10mo Ciclo', value: 10 },
];

export interface RegisterStudentFormValue {
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  repeatPassword: FormControl<string>;
  profilePictureUrl: FormControl<string>;
  career: FormControl<number | null>;
  term: FormControl<number | null>;
  acceptConditions: FormControl<boolean>;
}

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const repeatPassword = control.get('repeatPassword')?.value;

  if (password && repeatPassword && password !== repeatPassword) {
    return { passwordMismatch: true };
  }
  return null;
};

@Component({
  selector: 'app-form-register',
  standalone: true,
  imports: [
    CommonModule,
    Input,
    ReactiveFormsModule,
    Select,
    MatCheckboxModule,
    MatAnchor,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './form-register.html',
  styleUrl: './form-register.css',
})
export class FormRegister implements OnInit {
  protected formGroup!: FormGroup<RegisterStudentFormValue>;
  private formBuilder = inject(NonNullableFormBuilder);
  private studentService = inject(StudentService);
  private careerService = inject(CareerService);
  private router = inject(Router);
  protected termOptions = TERM_OPTIONS;
  protected careerGroup: WritableSignal<Option[]> = signal<Option[]>([]);
  protected profileImagePreview: WritableSignal<string | null> = signal<string | null>(null);
  protected selectedFile: WritableSignal<File | null> = signal<File | null>(null);

  constructor() {
    this.formGroup = this.formBuilder.group<RegisterStudentFormValue>(
      {
        name: this.formBuilder.control('', {
          validators: [Validators.required, Validators.minLength(2)],
        }),
        email: this.formBuilder.control('', {
          validators: [Validators.required, Validators.email],
        }),
        password: this.formBuilder.control('', {
          validators: [Validators.required, Validators.minLength(6)],
        }),
        repeatPassword: this.formBuilder.control('', {
          validators: [Validators.required, Validators.minLength(6)],
        }),
        profilePictureUrl: this.formBuilder.control(''),
        career: this.formBuilder.control<number | null>(null, {
          validators: [Validators.required],
        }),
        term: this.formBuilder.control<number | null>(null, { validators: [Validators.required] }),
        acceptConditions: this.formBuilder.control(false, {
          validators: [Validators.requiredTrue],
        }),
      },
      { validators: passwordMatchValidator }
    );
  }

  ngOnInit() {
    this.careerService.index().subscribe({
      next: (response: Option[]) => {
        console.log(response);
        this.careerGroup.set(response);
      },
    });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const v = this.formGroup.getRawValue();

    const payload: StudentModelCreateRest = {
      username: this.formGroup.value.name ?? '',
      email: this.formGroup.value.email ?? '',
      password: this.formGroup.value.password ?? '',
      currentSemester: this.formGroup.value.term ?? 0,
      careerIds: this.formGroup.value.career != null ? [this.formGroup.value.career] : [],
      profilePictureUrl: this.selectedFile()
        ? this.profileImagePreview() ?? ''
        : v.profilePictureUrl || '',
    };

    console.log('Submitting registration with payload:', payload);

    this.studentService.store(payload).subscribe({
      next: (response) => {
        console.log('Student registered successfully:', response);
        this.router.navigate(['/private/home']);
      },
      error: (error) => {
        console.error('Error registering student:', error);
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) return;
      if (file.size > 2 * 1024 * 1024) return; // 2MB limit
      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = (e) => this.profileImagePreview.set(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile.set(null);
    this.profileImagePreview.set(null);
    this.formGroup.controls.profilePictureUrl.setValue('');
  }

  onPreviewError(): void {
    // If preview image fails to load, clear preview to show placeholder
    this.selectedFile.set(null);
    this.profileImagePreview.set(null);
    this.formGroup.controls.profilePictureUrl.setValue('');
  }
}
