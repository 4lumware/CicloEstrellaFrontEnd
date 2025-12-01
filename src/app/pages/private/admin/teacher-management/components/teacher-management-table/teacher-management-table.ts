import {
  AfterViewInit,
  Component,
  inject,
  signal,
  WritableSignal,
  viewChild,
  output,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TitleCasePipe } from '@angular/common';
import { TeacherManagementSearchForm } from '../teacher-management-search-form/teacher-management-search-form';
import { PageResponse } from '../../../../../../core/models/responses/response';
import { RequestContentModel } from '../../../../../../core/models/requests/requests';
import { TeacherModel, TeacherParamsFilter } from '../../../../../../core/models/teachers/teacher';
import { SharedPaginator } from '../../../../../../shared/components/ui/shared-paginator/shared-paginator';
import { TeacherManagementDetailDialog } from '../dialogs/teacher-management-detail-dialog/teacher-management-detail-dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { TeacherService } from '../../../../../../core/services/teachers/teachers-service';
import { MatChipsModule } from '@angular/material/chips';
import { SnackbarNotificationService } from '../../../../../../core/services/notifications/snackbar-notification-service';

@Component({
  selector: 'app-teacher-management-table',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTooltipModule,
    TitleCasePipe,
    MatChipsModule,
    TeacherManagementSearchForm,
    SharedPaginator,
  ],
  templateUrl: './teacher-management-table.html',
  styleUrl: './teacher-management-table.css',
})
export class TeacherManagementTable implements AfterViewInit {
  public teacherCreate = output<void>();
  public teacherUpdate = output<TeacherModel>();
  public teacherDelete = output<TeacherModel>();
  public teacherDeleteMultiple = output<TeacherModel[]>();
  private service = inject(TeacherService);
  private dialog = inject(MatDialog);
  protected snackBar: SnackbarNotificationService = inject(SnackbarNotificationService);

  // include a selection column at the start
  protected displayedColumns: string[] = [
    'id',
    'fullName',
    'averageRating',
    'careers',
    'campuses',
    'courses',
    'actions',
  ];

  protected dataSource: WritableSignal<TeacherModel[]> = signal<TeacherModel[]>([]);
  protected size = signal<number>(0);
  protected totalItems = signal<number>(0);
  protected isRefreshing: WritableSignal<boolean> = signal<boolean>(false);

  protected selectedRows: WritableSignal<TeacherModel[]> = signal<TeacherModel[]>([]);
  protected countSelected = signal<number>(0);

  private paginator = viewChild(SharedPaginator);

  protected filters = signal<TeacherParamsFilter>({
    fullName: '',
    minRating: null,
    maxRating: null,
    careerIds: null,
    campusIds: null,
    courseIds: null,
  });

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    Promise.resolve().then(() => this.loadRequests());
  }

  onPageChange(e: any): void {
    this.loadRequests(e.pageIndex, e.pageSize);
  }

  onSearchApply(filters: any): void {
    this.filters.set(filters);
    this.loadRequests(0);
    this.paginator()?.goToFirstPage();
  }

  onSearchClear(): void {
    this.filters.set({
      fullName: '',
      minRating: null,
      maxRating: null,
      careerIds: null,
      campusIds: null,
      courseIds: null,
    });
    this.loadRequests(0);
    this.paginator()?.goToFirstPage();
  }

  public loadRequests(pageIndex?: number, pageSize?: number): void {
    const pIndex = pageIndex ?? this.paginator()?.currentPageIndex ?? 0;
    const pSize = pageSize ?? this.paginator()?.currentPageSize ?? 5;

    const spinnerMinMs = 1000;
    const start = Date.now();
    this.isRefreshing.set(true);
    const f = this.filters();
    const params: TeacherParamsFilter = {
      page: pIndex,
      size: pSize,
      fullName: f?.fullName ?? '',
      minRating: f?.minRating ?? null,
      maxRating: f?.maxRating ?? null,
      careerIds: f?.careerIds ?? null,
      campusIds: f?.campusIds ?? null,
      courseIds: f?.courseIds ?? null,
    };

    this.service.index(params).subscribe({
      next: (response: PageResponse<TeacherModel[]>) => {
        const data: any = response.data;

        this.size.set(data.size ?? data.size);
        this.totalItems.set(data.totalElements);
        this.dataSource.set(data.content ?? []);

        const elapsed = Date.now() - start;
        const remaining = Math.max(0, spinnerMinMs - elapsed);

        setTimeout(() => this.isRefreshing.set(false), remaining);
      },

      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.dataSource.set([]);
          this.size.set(0);
          this.totalItems.set(0);
          const elapsed = Date.now() - start;
          const remaining = Math.max(0, spinnerMinMs - elapsed);
          setTimeout(() => this.isRefreshing.set(false), remaining);
          this.snackBar.error('No se encontraron profesores');
          return;
        }

        this.snackBar.error('Error cargando profesores');
        this.dataSource.set([]);
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, spinnerMinMs - elapsed);
        setTimeout(() => this.isRefreshing.set(false), remaining);
      },
    });
  }

  public setRefreshing(value: boolean): void {
    this.isRefreshing.set(value);
  }

  onViewDetails(item: TeacherModel): void {
    this.dialog.open(TeacherManagementDetailDialog, {
      data: item,
      width: '680px',
      maxWidth: '95vw',
    });
  }

  onDelete(item: TeacherModel): void {
    this.teacherDelete.emit(item);
  }

  onUpdate(item: TeacherModel): void {
    this.teacherUpdate.emit(item);
  }

  onRowClick(row: TeacherModel): void {
    this.toggleRowSelection(row);
  }

  toggleRowSelection(row: TeacherModel): void {
    const selected = this.selectedRows();
    const idx = selected.findIndex((s) => s.id === row.id);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(row);
    }
    this.selectedRows.set([...selected]);
    this.countSelected.set(this.selectedRows().length);
  }

  isSelected(row: TeacherModel): boolean {
    return this.selectedRows().some((selected) => selected.id === row.id);
  }

  toggleSelectAll(checked: boolean): void {
    if (checked) {
      this.selectedRows.set([...this.dataSource()]);
    } else {
      this.selectedRows.set([]);
    }
    this.countSelected.set(this.selectedRows().length);
  }

  deleteSelected(): void {
    const selected = this.selectedRows();
    if (selected.length === 0) return;
    this.teacherDeleteMultiple.emit(selected);
    this.selectedRows.set([]);
    this.countSelected.set(0);
  }

  onImgError(event: any): void {
    try {
      const img = event?.target as HTMLImageElement;
      if (!img) return;

      img.onerror = null;
      img.dataset['fallbackSet'] = '1';
    } catch (_e) {}
  }
}
