import { Component, inject, OnInit, output } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Input } from '../../../../../../shared/components/forms/input/input';

export interface FormalityManagementFilterFormValue {
  title?: string;
  description?: string;
  from?: Date | null;
  to?: Date | null;
}

export interface FormalityManagementFilterForm {
  title: FormControl<string>;
  description: FormControl<string>;
  from: FormControl<Date | null>;
  to: FormControl<Date | null>;
}

@Component({
  selector: 'app-formality-management-search-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    Input,
  ],
  templateUrl: './formality-management-search-form.html',
  styleUrls: ['./formality-management-search-form.css'],
})
export class FormalityManagementSearchForm implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  public formGroup!: FormGroup<FormalityManagementFilterForm>;

  applyFilters = output<FormalityManagementFilterFormValue>();
  clearFilters = output<void>();

  constructor() {
    this.formGroup = this.fb.group<FormalityManagementFilterForm>({
      title: this.fb.control(''),
      description: this.fb.control(''),
      from: this.fb.control<Date | null>(null),
      to: this.fb.control<Date | null>(null),
    });
  }

  ngOnInit(): void {}

  onApplyFilters(): void {
    const v = this.formGroup.value as unknown as FormalityManagementFilterFormValue;
    this.applyFilters.emit(v);
  }

  onClearFilters(): void {
    this.formGroup.reset({ title: '', description: '', from: null, to: null });
    this.clearFilters.emit();
  }
}
