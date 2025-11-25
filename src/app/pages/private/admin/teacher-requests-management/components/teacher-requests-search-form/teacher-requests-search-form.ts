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

export interface TeacherRequestsFilterFormValue {
  studentName: string;
  teacherName: string;
  from: Date | null;
  to: Date | null;
}

export interface TeacherRequestsFilterForm {
  studentName: FormControl<string>;
  teacherName: FormControl<string>;
  from: FormControl<Date | null>;
  to: FormControl<Date | null>;
  courseId: FormControl<number | null>;
  campusId: FormControl<number | null>;
}

@Component({
  selector: 'app-teacher-requests-search-form',
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
    Select,
  ],
  templateUrl: './teacher-requests-search-form.html',
  styleUrl: './teacher-requests-search-form.css',
})
export class TeacherRequestsSearchForm implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  public formGroup!: FormGroup<TeacherRequestsFilterForm>;
  private courseService = inject(CourseService);
  private campusService = inject(CampusService);
  protected courseOptions: WritableSignal<Option[]> = signal<Option[]>([]);
  protected campusOptions: WritableSignal<Option[]> = signal<Option[]>([]);
  applyFilters = output<TeacherRequestsFilterFormValue>();
  clearFilters = output<void>();

  constructor() {
    this.formGroup = this.fb.group<TeacherRequestsFilterForm>({
      studentName: this.fb.control(''),
      teacherName: this.fb.control(''),
      from: this.fb.control<Date | null>(null),
      to: this.fb.control<Date | null>(null),
      courseId: this.fb.control<number | null>(null),
      campusId: this.fb.control<number | null>(null),
    });
  }

  ngOnInit(): void {
    this.loadCourseOptions();
    this.loadCampusOptions();
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

  onApplyFilters(): void {
    const v = this.formGroup.value as unknown as TeacherRequestsFilterFormValue;
    this.applyFilters.emit(v);
  }

  onClearFilters(): void {
    this.formGroup.reset({
      studentName: '',
      teacherName: '',
      from: null,
      to: null,
      courseId: null,
      campusId: null,
    });
    this.clearFilters.emit();
  }
}
