import { AfterViewInit, Component, inject, signal, WritableSignal, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TitleCasePipe } from '@angular/common';
import {
  TeacherRequestsFilterForm,
  TeacherRequestsFilterFormValue,
  TeacherRequestsSearchForm,
} from '../teacher-requests-search-form/teacher-requests-search-form';
import { TeacherRequestService } from '../../../../../../core/services/teacher-requests/teacher-requests-service';
import { PageResponse } from '../../../../../../core/models/responses/response';
import {
  RequestContentModel,
  TeacherRequestParamsFilter,
} from '../../../../../../core/models/requests/requests';
import { TeacherModel } from '../../../../../../core/models/teachers/teacher';
import { DatePipe } from '@angular/common';
import { ConfirmDialog } from '../../../../../../shared/components/ui/confirm-dialog/confirm-dialog';
import { SharedPaginator } from '../../../../../../shared/components/ui/shared-paginator/shared-paginator';
import { TeacherDetailDialog } from '../dialogs/teacher-detail-dialog/teacher-detail-dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarNotificationService } from '../../../../../../core/services/notifications/snackbar-notification-service';

@Component({
  selector: 'app-teacher-requests-table',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    TitleCasePipe,
    TeacherRequestsSearchForm,
    SharedPaginator,
    DatePipe,
  ],
  templateUrl: './teacher-requests-table.html',
  styleUrl: './teacher-requests-table.css',
})
export class TeacherRequestsTable implements AfterViewInit {
  private service = inject(TeacherRequestService);
  private dialog = inject(MatDialog);
  protected snackBar: SnackbarNotificationService = inject(SnackbarNotificationService);

  protected displayedColumns: string[] = [
    'id',
    'student',
    'requestType',
    'teacher',
    'status',
    'createdAt',
    'actions',
  ];
  protected dataSource: WritableSignal<RequestContentModel<TeacherModel[]>[]> = signal<
    RequestContentModel<TeacherModel[]>[]
  >([]);
  protected size = signal<number>(0);
  protected totalItems = signal<number>(0);
  protected isRefreshing: WritableSignal<boolean> = signal<boolean>(false);

  protected selectedRows: WritableSignal<RequestContentModel<TeacherModel[]>[]> = signal([] as any);

  private paginator = viewChild(SharedPaginator);

  protected filters = signal<any>({
    status: null,
    type: null,
    studentName: '',
    teacherName: '',
    startDate: null,
    endDate: null,
  });

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    Promise.resolve().then(() => this.loadRequests());
  }

  onPageChange(e: any): void {
    this.loadRequests(e.pageIndex, e.pageSize);
  }

  onSearchApply(filters: TeacherRequestsFilterFormValue): void {
    this.filters.set(filters);
    this.loadRequests(0);
  }

  onSearchClear(): void {
    this.filters.set({
      status: null,
      type: null,
      studentName: '',
      teacherName: '',
      startDate: null,
      endDate: null,
    });
    this.loadRequests(0);
  }

  openConfirm(
    action: 'accept' | 'reject' | 'delete',
    item: RequestContentModel<TeacherModel[]>
  ): void {
    const messages: any = {
      accept: { title: 'Aceptar solicitud', message: '¿Aceptar esta solicitud?' },
      reject: { title: 'Rechazar solicitud', message: '¿Rechazar esta solicitud?' },
      delete: { title: 'Eliminar solicitud', message: '¿Eliminar esta solicitud?' },
    };

    const ref = this.dialog.open(ConfirmDialog, {
      data: { ...messages[action], confirmLabel: 'Sí', cancelLabel: 'No' },
    });
    ref.afterClosed().subscribe((ok) => {
      if (!ok) return;
      if (action === 'delete') {
        const id = parseInt(item.id as any, 10);
        this.service
          .destroy(id, item.student.id)
          .subscribe({ next: () => this.afterMutate('Eliminada') });
      } else if (action === 'accept') {
        const id = parseInt(item.id as any, 10);
        this.service.acceptRequest(id).subscribe({ next: () => this.afterMutate('Aceptada') });
      } else if (action === 'reject') {
        const id = parseInt(item.id as any, 10);
        this.service.rejectRequest(id).subscribe({ next: () => this.afterMutate('Rechazada') });
      }
    });
  }

  private afterMutate(msg: string): void {
    this.snackBar.success(`Solicitud ${msg}`);
    this.loadRequests();
  }

  public loadRequests(pageIndex?: number, pageSize?: number): void {
    const pIndex = pageIndex ?? this.paginator()?.currentPageIndex ?? 0;
    const pSize = pageSize ?? this.paginator()?.currentPageSize ?? 5;

    const spinnerMinMs = 1000;
    const start = Date.now();
    this.isRefreshing.set(true);
    const f = this.filters();
    const params: TeacherRequestParamsFilter = {
      page: pIndex,
      size: pSize,
      studentName: f?.studentName ?? '',
      teacherName: f?.teacherName ?? '',
      startDate: f?.from ? (f.from instanceof Date ? f.from.toISOString() : f.from) : '',
      endDate: f?.to ? (f.to instanceof Date ? f.to.toISOString() : f.to) : '',
      courseId: f?.courseId ?? null,
      campusId: f?.campusId ?? null,
    };

    this.service.index(params).subscribe({
      next: (response: PageResponse<RequestContentModel<TeacherModel[]>>) => {
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
          this.snackBar.error('No se encontraron solicitudes de profesores');
          return;
        }

        this.snackBar.error('Error cargando solicitudes');
        this.dataSource.set([]);
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, spinnerMinMs - elapsed);
        setTimeout(() => this.isRefreshing.set(false), remaining);
      },
    });
  }

  openTeacherDetail(item: RequestContentModel<TeacherModel[]>): void {
    // pass the full request item to the dialog so the dialog can read
    // rating from the request payload (requests carry the rating on some payloads)
    this.dialog.open(TeacherDetailDialog, { data: item, width: '680px', maxWidth: '95vw' });
  }

  contentNames(item: RequestContentModel<TeacherModel[]>): string {
    const list = item?.content ?? [];
    if (!list || list.length === 0) return '-';
    return (list as TeacherModel[])
      .map((t) => `${t.firstName ?? ''}${t.lastName ? ' ' + t.lastName : ''}`.trim())
      .filter((s) => s)
      .join(', ');
  }

  // image error fallback for avatars inside the table
  onImgError(event: any): void {
    try {
      const img = event?.target as HTMLImageElement;
      if (!img) return;

      img.onerror = null;
      img.dataset['fallbackSet'] = '1';
    } catch (_e) {}
  }
}
