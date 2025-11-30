import {Component, inject, OnInit, signal, viewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotComponent } from '../../../../shared/components/chatbot/chatbot.component';
import {TeacherService} from '../../../../core/services/teachers/teachers-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TeacherModel, TeacherParamsFilter} from '../../../../core/models/teachers/teacher';
import {MatIconButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatCard} from '@angular/material/card';
import {MatTooltip} from '@angular/material/tooltip';
import {RouterLink} from '@angular/router';
import {PageResponse} from '../../../../core/models/responses/response';
import {PageEvent} from '@angular/material/paginator';
import {
  FiltroComponent
} from '../../../../layout/private/user/authenticated-user-filter-profesores/authenticated-user-filter-profesores';
import {
  SharedPaginatorTeachers
} from '../../../../shared/components/ui/shared-paginator-teachers/shared-paginator-teachers';

@Component({
  selector: 'app-user-profesores',
  templateUrl: './user-profesores.component.html',
  styleUrls: ['./user-profesores.component.css'],
  imports: [CommonModule, FormsModule, ChatbotComponent, MatIconButton, MatProgressSpinner, MatCard, MatTooltip, RouterLink, FiltroComponent, SharedPaginatorTeachers],
})
export class UserProfesoresComponent implements OnInit {
  private teacherService = inject(TeacherService);
  private snackBar = inject(MatSnackBar);

  // ViewChild del paginador
  protected paginator = viewChild<SharedPaginatorTeachers>('paginator');

  // Estado
  searchQuery = signal<string>('');
  showFiltro = signal<boolean>(false);
  chatbotVisible = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  hasSearched = signal<boolean>(false);

  // Datos
  protected profesores = signal<TeacherModel[]>([]);
  protected totalElements = signal<number>(0);
  protected pageIndex = signal<number>(0);
  protected pageSize = signal<number>(10);

  // Filtros
  protected filters = signal<TeacherParamsFilter>({
    fullName: '',
    minRating: null,
    maxRating: null,
    careerIds: null,
    campusIds: null,
    courseIds: null,
  });

  ngOnInit(): void {
    // Cargar datos iniciales
    this.search();
  }

  toggleFiltro() {
    this.showFiltro.update(v => !v);
  }

  // Aplicar filtros desde el componente hijo
  onFiltersApplied(newFilters: TeacherParamsFilter) {
    this.filters.update(current => ({
      ...current,
      ...newFilters,
      fullName: this.searchQuery(), // Mantener búsqueda actual
    }));

    // Resetear a página 0
    this.pageIndex.set(0);
    this.paginator()?.goToFirstPage();

    this.search();
    this.showFiltro.set(false);
  }

  // Manejar cambio de página
  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.search();
  }

  // Ejecutar búsqueda
  search() {
    this.isLoading.set(true);

    const params: TeacherParamsFilter = {
      ...this.filters(),
      fullName: this.searchQuery(),
      page: this.pageIndex(),
      size: this.pageSize(),
    };

    // Detectar si hay búsqueda activa
    this.hasSearched.set(
      !!(
        this.searchQuery() ||
        params.campusIds?.length ||
        params.careerIds?.length ||
        params.courseIds?.length
      )
    );

    this.teacherService.index(params).subscribe({
      next: (response: PageResponse<TeacherModel[]>) => {
        if (response.data && response.data.content) {
          this.profesores.set(response.data.content);
          this.totalElements.set(response.data.totalElements);
        } else {
          this.profesores.set([]);
          this.totalElements.set(0);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.profesores.set([]);
        this.totalElements.set(0);
        this.isLoading.set(false);

        if (err.status !== 404) {
          this.snackBar.open('Error al cargar profesores.', 'Cerrar', {
            duration: 3000,
          });
        }
      },
    });
  }

  // Ejecutar búsqueda al presionar Enter
  onSearchEnter() {
    this.pageIndex.set(0);
    this.paginator()?.goToFirstPage();
    this.search();
  }

  addToProfile(profesor: TeacherModel) {
    this.snackBar.open(
      `Agregaste a ${profesor.firstName} a tu biblioteca`,
      'OK',
      { duration: 2000 }
    );
  }

  toggleChatbot() {
    this.chatbotVisible.update(v => !v);
  }

  // Helpers
  getCareersDisplay(profesor: TeacherModel): string {
    return profesor.careers?.map((c) => c.careerName).join(', ') || 'General';
  }

  getCoursesDisplay(profesor: TeacherModel): string {
    return profesor.courses?.map((c) => c.courseName).join(', ') || 'General';
  }
}
