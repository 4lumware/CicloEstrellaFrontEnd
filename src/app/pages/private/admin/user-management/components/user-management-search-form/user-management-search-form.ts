import {
  Component,
  inject,
  input,
  InputSignal,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Select, Option as SelectOption } from '../../../../../../components/forms/select/select';
import { Input } from '../../../../../../components/forms/input/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { RolesService } from '../../../../../../services/roles/roles';

export interface UserManagementSearchFormValue {
  username: FormControl<string>;
  email: FormControl<string>;
  roleName: FormControl<string>;
  state: FormControl<string | boolean>;
  startDate: FormControl<Date | null>;
  endDate: FormControl<Date | null>;
}
@Component({
  selector: 'app-user-management-search-form',
  imports: [
    ReactiveFormsModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    Select,
    Input,
    MatIconModule,
  ],
  templateUrl: './user-management-search-form.html',
  styleUrl: './user-management-search-form.css',
})
export class UserManagementSearchForm {
  public formGroup!: FormGroup<UserManagementSearchFormValue>;

  clearFilters = output<void>();

  protected roleOptions: WritableSignal<SelectOption[]> = signal<SelectOption[]>([]);
  private roleService = inject(RolesService);
  private fb = inject(NonNullableFormBuilder);

  stateOptions: SelectOption[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  constructor() {
    this.roleService.index().subscribe({
      next: (response: any) => {
        const options = response.data;
        const selectedOptions = options.map((role: any) => ({
          label: role.roleName,
          value: role.roleName,
        }));
        this.roleOptions.set([{ label: 'Todos', value: 'all' }, ...selectedOptions]);
      },
    });

    this.formGroup = this.fb.group<UserManagementSearchFormValue>({
      username: this.fb.control(''),
      email: this.fb.control(''),
      roleName: this.fb.control('all'),
      state: this.fb.control('all'),
      startDate: this.fb.control<Date | null>(null),
      endDate: this.fb.control<Date | null>(null),
    });
  }

  onClearFilters(): void {
    this.formGroup.reset({
      username: '',
      roleName: 'all',
      state: 'all',
      startDate: null,
      endDate: null,
    });
  }
}
