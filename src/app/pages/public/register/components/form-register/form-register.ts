import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAnchor, MatButtonModule } from '@angular/material/button';
import { Option, Select } from '../../../../../shared/components/forms/select/select';
import { Input } from '../../../../../shared/components/forms/input/input';
import { CareerService } from '../../../../../core/services/careers/career-service';

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
  career: FormControl<string>;
  term: FormControl<number | null>;
  acceptConditions: FormControl<boolean>;
}

@Component({
  selector: 'app-form-register',
  standalone: true,
  imports: [Input, ReactiveFormsModule, Select, MatCheckboxModule, MatAnchor, MatButtonModule],
  templateUrl: './form-register.html',
  styleUrl: './form-register.css',
})
export class FormRegister implements OnInit {
  protected formGroup!: FormGroup<RegisterStudentFormValue>;
  private formBuilder = inject(NonNullableFormBuilder);
  private careerService = inject(CareerService);
  protected termOptions = TERM_OPTIONS;
  protected careerGroup: WritableSignal<Option[]> = signal<Option[]>([]);

  constructor() {
    this.formGroup = this.formBuilder.group<RegisterStudentFormValue>({
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
      career: this.formBuilder.control('', {
        validators: [Validators.required],
      }),
      term: this.formBuilder.control<number | null>(null, { validators: [Validators.required] }),
      acceptConditions: this.formBuilder.control(false, {
        validators: [Validators.requiredTrue],
      }),
    });
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
    console.log(this.formGroup.value);
  }
}
