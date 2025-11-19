import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  output,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
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
import { MatStepperModule } from '@angular/material/stepper';
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
import { SnackbarNotificationService } from '../../../../../core/services/notifications/snackbar-notification-service';
import { ProfileImageUploader } from '../../../../../shared/components/forms/profile-image-uploader/profile-image-uploader';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { buildFormRegister } from '../../logic/form-register-builder';

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

export const passwordMatchOnControl: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const parent = control.parent;
  if (!parent) return null; // si aún no está enlazado al parent
  const password = parent.get('password')?.value;
  const repeat = control.value;

  return password && repeat && password !== repeat ? { passwordMismatch: true } : null;
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
    MatStepperModule,
    ProfileImageUploader,
  ],
  templateUrl: './form-register.html',
  styleUrl: './form-register.css',
})
export class FormRegister implements OnInit {
  protected formGroup!: FormGroup;
  private formBuilder = inject(NonNullableFormBuilder);
  private studentService = inject(StudentService);
  private careerService = inject(CareerService);
  private router = inject(Router);
  private snackbar = inject(SnackbarNotificationService);
  protected termOptions = TERM_OPTIONS;
  protected careerGroup: WritableSignal<Option[]> = signal<Option[]>([]);
  protected isLinear = true;
  private destroyRef = inject(DestroyRef);
  protected profilePictureValue: WritableSignal<string | null> = signal<string | null>(null);
  protected userResume = signal({
    username: '',
    email: '',
    career: '',
    term: '',
    profilePictureUrl: '',
  });
  constructor() {
    this.formGroup = buildFormRegister(this.formBuilder);
  }

  protected get accountGroup() {
    return this.formGroup.get('account') as FormGroup;
  }

  protected get academicGroup() {
    return this.formGroup.get('academic') as FormGroup;
  }

  protected get profileGroup() {
    return this.formGroup.get('profile') as FormGroup;
  }

  protected get nameControl(): FormControl {
    return this.accountGroup.get('name') as FormControl;
  }

  protected get emailControl(): FormControl {
    return this.accountGroup.get('email') as FormControl;
  }

  protected get careerControl(): FormControl {
    return this.academicGroup.get('career') as FormControl;
  }

  protected get termControl(): FormControl {
    return this.academicGroup.get('term') as FormControl;
  }

  protected get passwordControl(): FormControl {
    return this.academicGroup.get('password') as FormControl;
  }

  protected get repeatPasswordControl(): FormControl {
    return this.academicGroup.get('repeatPassword') as FormControl;
  }

  protected get profilePictureControl(): FormControl {
    return this.profileGroup.get('profilePictureUrl') as FormControl;
  }

  protected get acceptConditionsControl(): FormControl {
    return this.profileGroup.get('acceptConditions') as FormControl;
  }

  ngOnInit() {
    this.careerService.index().subscribe({
      next: (response: Option[]) => {
        console.log(response);
        this.careerGroup.set(response);
      },
    });

    this.formGroup.get('password')?.valueChanges.subscribe(() => {
      this.formGroup.get('repeatPassword')?.updateValueAndValidity({ onlySelf: true });
    });

    const ctrl = this.profilePictureControl;
    this.profilePictureValue.set(ctrl?.value ?? null);

    ctrl?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((v) => this.profilePictureValue.set(v));

    this.formGroup.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      const account = value.account;
      const academic = value.academic;
      const profile = value.profile;

      this.userResume.set({
        username: account?.name ?? '',
        email: account?.email ?? '',
        career: this.careerGroup().find((o) => o.value === academic?.career)?.label || '',
        term: this.termOptions.find((o) => o.value === academic?.term)?.label || '',
        profilePictureUrl: profile?.profilePictureUrl ?? '',
      });

      console.log('Form changes:', this.userResume());
    });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const account = this.accountGroup.getRawValue();
    const academic = this.academicGroup.getRawValue();
    const profile = this.profileGroup.getRawValue();

    const payload: StudentModelCreateRest = {
      username: account.name ?? '',
      email: account.email ?? '',
      password: academic.password ?? '',
      currentSemester: academic.term ?? 0,
      careerIds: academic.career != null ? [academic.career] : [],
      profilePictureUrl: profile.profilePictureUrl || '',
    };

    console.log('Submitting registration with payload:', payload);

    this.studentService.store(payload).subscribe({
      next: (response) => {
        console.log('Student registered successfully:', response);
        this.router.navigate(['/private/home']);
      },
      error: (error) => {
        const message = error?.error?.message || 'Ocurrio un error al registrar el estudiante';
        this.snackbar.error(message);
      },
    });
  }
}
