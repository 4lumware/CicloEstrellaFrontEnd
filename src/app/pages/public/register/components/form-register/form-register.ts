import { Component, inject } from '@angular/core';
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
export const CAREER_OPTIONS: Option[] = [
  { label: 'Ingeniería de Sistemas', value: 'ingenieria_sistemas' },
  { label: 'Ingeniería Industrial', value: 'ingenieria_industrial' },
  { label: 'Ingeniería Civil', value: 'ingenieria_civil' },
  { label: 'Ingeniería Mecánica', value: 'ingenieria_mecanica' },
  { label: 'Ingeniería Electrónica', value: 'ingenieria_electronica' },

  { label: 'Arquitectura', value: 'arquitectura' },

  { label: 'Administración de Empresas', value: 'administracion' },
  { label: 'Contabilidad', value: 'contabilidad' },
  { label: 'Economía', value: 'economia' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Negocios Internacionales', value: 'negocios_internacionales' },

  { label: 'Derecho', value: 'derecho' },
  { label: 'Ciencias Políticas', value: 'ciencias_politicas' },

  { label: 'Medicina Humana', value: 'medicina' },
  { label: 'Enfermería', value: 'enfermeria' },
  { label: 'Odontología', value: 'odontologia' },
  { label: 'Nutrición', value: 'nutricion' },
  { label: 'Psicología', value: 'psicologia' },

  { label: 'Ciencias de la Comunicación', value: 'comunicacion' },
  { label: 'Diseño Gráfico', value: 'diseno_grafico' },
  { label: 'Diseño de Producto', value: 'diseno_producto' },
  { label: 'Arte y Diseño', value: 'arte_diseno' },

  { label: 'Educación Inicial', value: 'educacion_inicial' },
  { label: 'Educación Primaria', value: 'educacion_primaria' },
  { label: 'Educación Secundaria', value: 'educacion_secundaria' },

  { label: 'Turismo y Hotelería', value: 'turismo_hoteleria' },
  { label: 'Gastronomía', value: 'gastronomia' },

  { label: 'Ciencias de la Computación', value: 'ciencias_computacion' },
  { label: 'Big Data & Analytics', value: 'bigdata_analytics' },
];
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
export class FormRegister {
  protected formGroup!: FormGroup;
  private formBuilder = inject(FormBuilder);
  protected careerOptions = CAREER_OPTIONS;
  protected termOptions = TERM_OPTIONS;

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
