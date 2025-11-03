import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAnchor, MatButtonModule } from '@angular/material/button';
import { Option, Select } from '../../../../../components/forms/select/select';
import { Input } from '../../../../../components/forms/input/input';
import {HttpClient} from '@angular/common/http';
import {ApiResponse, CareerService} from '../../../../../services/careers/career-service';

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

@Component({
  selector: 'app-form-register',
  imports: [Input, ReactiveFormsModule, Select, MatCheckboxModule, MatAnchor, MatButtonModule],
  templateUrl: './form-register.html',
  styleUrl: './form-register.css',
})
export class FormRegister implements OnInit{
  protected formGroup!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private careerService = inject(CareerService);
  protected termOptions = TERM_OPTIONS;
  protected careerGroup : WritableSignal<Option[]> = signal<Option[]>([]);

  constructor() {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      career: ['', Validators.required],
      term: ['', Validators.required],
      acceptConditions: [false, Validators.requiredTrue],
    });
  }

  ngOnInit() {
    this.careerService.index().subscribe({
        next : (response : Option[]) => {
          console.log(response);
          this.careerGroup.set(response);
        }
      }
    )
  }

  get nameControl() {
    return this.formGroup.get('name') as FormControl;
  }

  get emailControl(): FormControl {
    return this.formGroup.get('email') as FormControl;
  }

  get passwordControl() {
    return this.formGroup.get('password') as FormControl;
  }

  get repeatPasswordControl() {
    return this.formGroup.get('repeatPassword') as FormControl;
  }

  get careerControl() {
    return this.formGroup.get('career') as FormControl;
  }

  get termControl() {
    return this.formGroup.get('term') as FormControl;
  }

  get acceptConditionsControl() {
    return this.formGroup.get('acceptConditions') as FormControl;
  }

  onSubmit() {
    console.log(this.formGroup.value);
  }
}
