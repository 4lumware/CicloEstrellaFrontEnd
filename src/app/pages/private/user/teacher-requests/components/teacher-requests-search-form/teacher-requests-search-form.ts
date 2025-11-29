import { Component, inject, OnInit, output, signal, WritableSignal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Option, Select } from '../../../../../../shared/components/forms/select/select';
import { CourseService } from '../../../../../../core/services/courses/courses-service';
import { Input } from '../../../../../../shared/components/forms/input/input';
import { CampusService } from '../../../../../../core/services/campuses/campuses-service';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { TeacherParamsFilter } from '../../../../../../core/models/teachers/teacher';
import { CareerService } from '../../../../../../core/services/careers/career-service';
import { from } from 'rxjs';

export type SelectOptionValue = number[] | 'all' | null;
export interface UserTeacherRequestsFilterForm {
  teacherName: FormControl<string>;
  careerId: FormControl<SelectOptionValue>;
  courseId: FormControl<SelectOptionValue>;
  campusId: FormControl<SelectOptionValue>;
  startDate: FormControl<Date | null>;
  endDate: FormControl<Date | null>;
}

export type NullableSelectOptionValue<T> = T[] | 'all' | null;
export interface UserTeacherRequestFilterValue {
  teacherName?: string | null;
  careerId?: NullableSelectOptionValue<number>;
  courseId?: NullableSelectOptionValue<number>;
  campusId?: NullableSelectOptionValue<number>;
  startDate?: Date | null;
  endDate?: Date | null;
}
@Component({
  selector: 'app-user-teacher-requests-search-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    Select,
    Input,
  ],
  templateUrl: './teacher-requests-search-form.html',
  styleUrls: ['./teacher-requests-search-form.css'],
})
export class UserTeacherRequestsSearchForm implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  public form!: FormGroup<UserTeacherRequestsFilterForm>;
  private courseService = inject(CourseService);
  private campusService = inject(CampusService);
  private careerService = inject(CareerService);
  protected courseOptions: WritableSignal<Option[]> = signal<Option[]>([]);
  protected campusOptions: WritableSignal<Option[]> = signal<Option[]>([]);
  protected careerOptions: WritableSignal<Option[]> = signal<Option[]>([]);

  applyFilters = output<UserTeacherRequestFilterValue>();
  clearFilters = output<void>();

  constructor() {
    this.form = this.fb.group<UserTeacherRequestsFilterForm>({
      teacherName: this.fb.control(''),
      courseId: this.fb.control(null),
      campusId: this.fb.control(null),
      careerId: this.fb.control(null),
      startDate: this.fb.control<Date | null>(null),
      endDate: this.fb.control<Date | null>(null),
    });
  }

  ngOnInit(): void {
    this.loadCourseOptions();
    this.loadCampusOptions();
    this.loadCareerOptions();
  }

  private loadCourseOptions(): void {
    this.courseService.index().subscribe({
      next: (resp: any) =>
        this.courseOptions.set([
          { value: 'all', label: 'Todos' },
          ...(resp.data || []).map((c: any) => ({ value: c.id, label: c.courseName })),
        ]),
    });
  }

  private loadCampusOptions(): void {
    this.campusService.index().subscribe({
      next: (resp: any) => {
        const options = (resp.data || []).map((c: any) => ({ value: c.id, label: c.campusName }));
        this.campusOptions.set([{ value: 'all', label: 'Todos' }, ...options]);
      },
    });
  }
  private loadCareerOptions(): void {
    this.careerService.index().subscribe({
      next: (resp: any) => {
        const options = (resp.data || []).map((c: any) => ({ value: c.id, label: c.careerName }));
        this.careerOptions.set([{ value: 'all', label: 'Todos' }, ...options]);
      },
    });
  }

  onApply(): void {
    const v = this.form.value;
    const filters: UserTeacherRequestFilterValue = {
      teacherName: v.teacherName || null,
      careerId: v.careerId === 'all' ? null : v.careerId,
      courseId: v.courseId === 'all' ? null : v.courseId,
      campusId: v.campusId === 'all' ? null : v.campusId,
      startDate: v.startDate,
      endDate: v.endDate,
    };
    console.log('Emitiendo filtros:', filters);
    this.applyFilters.emit(filters);
  }

  onClear(): void {
    this.form.reset({
      teacherName: '',
      careerId: null,
      courseId: null,
      campusId: null,
      startDate: null,
      endDate: null,
    });
    this.clearFilters.emit();
  }
}
