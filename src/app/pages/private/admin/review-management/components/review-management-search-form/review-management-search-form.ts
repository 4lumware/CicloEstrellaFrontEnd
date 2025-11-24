import { Component, inject, output, signal, WritableSignal } from '@angular/core';
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
import { MatSliderModule } from '@angular/material/slider';
import { Option as SelectOption } from '../../../../../../shared/components/forms/select/select';
import { TagModel } from '../../../../../../core/models/tags/tags';
import { TagService } from '../../../../../../core/services/tags/tag-service';

export interface ReviewFilterFormValue {
  keyword: string;
  studentName: string;
  teacherName: string;
  minRating: number | null;
  maxRating: number | null;
  tagId: number | null;
  from: Date | null;
  to: Date | null;
}

export interface ReviewFilterForm {
  keyword: FormControl<string>;
  studentName: FormControl<string>;
  teacherName: FormControl<string>;
  minRating: FormControl<number | null>;
  maxRating: FormControl<number | null>;
  tagId: FormControl<number | null>;
  from: FormControl<Date | null>;
  to: FormControl<Date | null>;
}

@Component({
  selector: 'app-review-management-search-form',
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
    MatSliderModule,
    Select,
  ],
  templateUrl: './review-management-search-form.html',
  styleUrl: './review-management-search-form.css',
})
export class ReviewManagementSearchForm {
  private fb = inject(NonNullableFormBuilder);
  public formGroup!: FormGroup<ReviewFilterForm>;
  applyFilters = output<any>();
  clearFilters = output<void>();

  protected tagOptions: WritableSignal<SelectOption[]> = signal<SelectOption[]>([]);

  private tagService = inject(TagService);

  constructor() {
    this.formGroup = this.fb.group<ReviewFilterForm>({
      keyword: this.fb.control(''),
      studentName: this.fb.control(''),
      teacherName: this.fb.control(''),
      minRating: this.fb.control<number | null>(null),
      maxRating: this.fb.control<number | null>(null),
      tagId: this.fb.control<number | null>(null),
      from: this.fb.control<Date | null>(null),
      to: this.fb.control<Date | null>(null),
    });
  }

  ngOnInit(): void {
    this.tagService.index().subscribe({
      next: (response: any) => {
        const options = response.data;
        const selectedOptions = options.map((tag: TagModel) => ({
          label: tag.tagName,
          value: tag.id,
        }));
        this.tagOptions.set([{ label: 'Todos', value: '' }, ...selectedOptions]);
      },
    });
  }

  onClearFilters(): void {
    this.formGroup.reset();
    this.clearFilters.emit();
  }

  onApplyFilters(): void {
    this.applyFilters.emit(this.formGroup.value);
  }
}
