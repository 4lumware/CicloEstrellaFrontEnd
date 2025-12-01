import { CommonModule } from '@angular/common';
import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {CampusService} from '../../../../core/services/campuses/campuses-service';
import {CareerService} from '../../../../core/services/careers/career-service';
import {CourseService} from '../../../../core/services/courses/courses-service';
import {TeacherParamsFilter} from '../../../../core/models/teachers/teacher';
import {CourseModel} from '../../../../core/models/courses/courses';
import {CampusModel} from '../../../../core/models/campuses/campuses';
import {CareerModel} from '../../../../core/models/careers/careers';
import {FormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-filtro',
  imports: [
    CommonModule,
    FormsModule,
    MatIcon,
    MatIconButton,
    MatButton,
    MatFormField,
    MatSelect,
    MatOption,
    MatOption,
    MatLabel
  ],
  templateUrl: './authenticated-user-filter-profesores.html',
  styleUrls: ['./authenticated-user-filter-profesores.css']
})
export class FiltroComponent implements OnInit {
  private campusService = inject(CampusService);
  private careerService = inject(CareerService);
  private courseService = inject(CourseService);

  @Output() close = new EventEmitter<void>();
  // Ahora emitimos el filtro compatible con tu Service
  @Output() filtersApplied = new EventEmitter<TeacherParamsFilter>();

  campuses: CampusModel[] = [];
  careers: CareerModel[] = [];
  courses: CourseModel[] = [];

  // CAMBIO: Ahora guardamos IDs (number) o null si no hay selección
  selectedCampusId: number | null = null;
  selectedCareerId: number | null = null;
  selectedCourseId: number | null = null;

  ngOnInit(): void {
    this.loadCatalogs();
  }

  loadCatalogs() {
    this.campusService.getAllCampuses().subscribe(data => this.campuses = data);
    this.careerService.getAllCareers().subscribe(data => this.careers = data);
    this.courseService.getAllCourses().subscribe(data => this.courses = data);
  }

  // Selección de Sede por ID
  selectSede(id: number) {
    this.selectedCampusId = this.selectedCampusId === id ? null : id;
  }

  closeFiltro() {
    this.close.emit();
  }

  applyFilters() {
    // Convertimos las selecciones individuales a Arrays para cumplir con TeacherParamsFilter
    const filters: TeacherParamsFilter = {
      campusIds: this.selectedCampusId ? [this.selectedCampusId] : null,
      careerIds: this.selectedCareerId ? [this.selectedCareerId] : null,
      courseIds: this.selectedCourseId ? [this.selectedCourseId] : null
    };
    this.filtersApplied.emit(filters);
  }

  resetFilters() {
    this.selectedCampusId = null;
    this.selectedCareerId = null;
    this.selectedCourseId = null;
    this.applyFilters();
  }
}
