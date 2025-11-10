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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RolesService } from '../../../../../../services/roles/roles';

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
  // Input: Recibe el FormGroup desde el padre
  searchForm: InputSignal<FormGroup> = input.required<FormGroup>();

  // Output: Emite evento para limpiar filtros
  clearFilters = output<void>();

  protected roleOptions: WritableSignal<SelectOption[]> = signal<SelectOption[]>([]);
  private roleService = inject(RolesService);

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
  }

  // Método para acceder a los controles del FormGroup
  get usernameControl(): FormControl {
    return this.searchForm().get('username') as FormControl;
  }

  get roleNameControl(): FormControl {
    return this.searchForm().get('roleName') as FormControl;
  }

  get stateControl(): FormControl {
    return this.searchForm().get('state') as FormControl;
  }

  get startDateControl(): FormControl {
    return this.searchForm().get('startDate') as FormControl;
  }

  get endDateControl(): FormControl {
    return this.searchForm().get('endDate') as FormControl;
  }

  onClearFilters(): void {
    this.clearFilters.emit();
  }
}
