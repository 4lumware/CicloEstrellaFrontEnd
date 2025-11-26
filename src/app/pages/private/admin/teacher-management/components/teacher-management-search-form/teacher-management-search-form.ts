import { Component, inject, OnInit, output, signal, WritableSignal } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CourseService } from '../../../../../../core/services/courses/courses-service';
import { CampusService } from '../../../../../../core/services/campuses/campuses-service';
import { Option, Select } from '../../../../../../shared/components/forms/select/select';
import { ApiResponse } from '../../../../../../core/models/responses/response';
import { CourseModel } from '../../../../../../core/models/courses/courses';
import { CampusModel } from '../../../../../../core/models/campuses/campuses';
import { CareerService } from '../../../../../../core/services/careers/career-service';
import { CareerModel } from '../../../../../../core/models/careers/careers';
import { Input } from '../../../../../../shared/components/forms/input/input';
import { MatSliderModule } from '@angular/material/slider';

export interface TeacherManagementFilterFormValue {
  fullName?: string;
  minRating?: number | null;
  maxRating?: number | null;
  careerIds?: number[] | null;
  courseIds?: number[] | null;
  campusIds?: number[] | null;
}

export interface TeacherManagementFilterForm {
  fullName: FormControl<string>;
  minRating: FormControl<number | null>;
  maxRating: FormControl<number | null>;
  careerIds: FormControl<number[] | null>;
  courseIds: FormControl<number[] | null>;
  campusIds: FormControl<number[] | null>;
}

@Component({
  selector: 'app-teacher-management-search-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatSliderModule,
    Select,
    Input,
  ],
  templateUrl: './teacher-management-search-form.html',
  styleUrl: './teacher-management-search-form.css',
})
export class TeacherManagementSearchForm implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  public formGroup!: FormGroup<TeacherManagementFilterForm>;
  private courseService = inject(CourseService);
  private campusService = inject(CampusService);
  private careerService = inject(CareerService);
  protected courseOptions: WritableSignal<Option[]> = signal<Option[]>([]);
  protected campusOptions: WritableSignal<Option[]> = signal<Option[]>([]);
  protected careerOptions: WritableSignal<Option[]> = signal<Option[]>([]);
  applyFilters = output<TeacherManagementFilterFormValue>();
  clearFilters = output<void>();

  constructor() {
    this.formGroup = this.fb.group<TeacherManagementFilterForm>({
      fullName: this.fb.control(''),
      minRating: this.fb.control<number | null>(null),
      maxRating: this.fb.control<number | null>(null),
      careerIds: this.fb.control<number[] | null>(null),
      courseIds: this.fb.control<number[] | null>(null),
      campusIds: this.fb.control<number[] | null>(null),
    });
  }

  ngOnInit(): void {
    this.loadCourseOptions();
    this.loadCampusOptions();
    this.loadCareerOptions();
  }

  private loadCourseOptions(): void {
    this.courseService.index().subscribe({
      next: (response: ApiResponse<CourseModel[]>) => {
        const options = response.data;
        const selectOptions = options.map((course: any) => ({
          label: course.courseName,
          value: course.id,
        }));
        this.courseOptions.set(selectOptions);
      },
    });
  }

  private loadCampusOptions(): void {
    this.campusService.index().subscribe({
      next: (response: ApiResponse<CampusModel[]>) => {
        const options = response.data;
        const selectOptions = options.map((campus: any) => ({
          label: campus.campusName,
          value: campus.id,
        }));
        this.campusOptions.set(selectOptions);
      },
    });
  }

  private loadCareerOptions(): void {
    this.careerService.index().subscribe({
      next: (response: Option[]) => {
        this.careerOptions.set(response);
      },
    });
  }

  onApplyFilters(): void {
    const v = this.formGroup.value as unknown as TeacherManagementFilterFormValue;
    this.applyFilters.emit(v);
  }

  onClearFilters(): void {
    this.formGroup.reset({
      fullName: '',
      minRating: null,
      maxRating: null,
      careerIds: null,
      courseIds: null,
      campusIds: null,
    });
    this.clearFilters.emit();
  }
}
