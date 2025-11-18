import { Component, inject } from '@angular/core';
import { Input } from '../../../../../../shared/components/forms/input/input';
import {
  Form,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Select } from '../../../../../../shared/components/forms/select/select';
import { MatIconModule } from '@angular/material/icon';

export interface CommentFilterForm {
  keyword: FormControl<string>;
  studentName: FormControl<string>;
  formalityTitle: FormControl<string>;
  from: FormControl<Date>;
  to: FormControl<Date>;
}

@Component({
  selector: 'app-comment-management-search-form',
  imports: [
    ReactiveFormsModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    Input,
    MatIconModule,
  ],
  templateUrl: './comment-management-search-form.html',
  styleUrl: './comment-management-search-form.css',
})
export class CommentManagementSearchForm {
  private fb = inject(NonNullableFormBuilder);
  protected formGroup!: FormGroup<CommentFilterForm>;

  constructor() {
    this.formGroup = this.fb.group<CommentFilterForm>({
      keyword: this.fb.control(''),
      studentName: this.fb.control(''),
      formalityTitle: this.fb.control(''),
      from: this.fb.control(new Date()),
      to: this.fb.control(new Date()),
    });
  }

  onClearFilters(): void {
    this.formGroup.reset();
  }
}
