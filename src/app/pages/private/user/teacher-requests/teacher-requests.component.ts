import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TeacherRequestService } from '../../../../core/services/teacher-requests/teacher-requests-service';
import { AuthCurrentUserService } from '../../../../core/services/users/auth/auth-current-user-service';
import { CreateRequestDialogComponent } from './dialogs/create-request-dialog/create-request-dialog.component';
import { RequestCardComponent } from './components/request-card/request-card.component';
import {
  UserTeacherRequestFilterValue,
  UserTeacherRequestsSearchForm,
} from './components/teacher-requests-search-form/teacher-requests-search-form';
import { RequestContentModel, RequestModelCreate } from '../../../../core/models/requests/requests';
import { TeacherModel } from '../../../../core/models/teachers/teacher';
import { PageResponse } from '../../../../core/models/responses/response';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TeacherDetailDialog } from '../../admin/teacher-requests-management/components/dialogs/teacher-detail-dialog/teacher-detail-dialog';

@Component({
  selector: 'app-teacher-requests',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RequestCardComponent,
    UserTeacherRequestsSearchForm,
    MatPaginatorModule,
  ],
  templateUrl: './teacher-requests.component.html',
  styleUrls: ['./teacher-requests.component.css'],
})
export class TeacherRequestsComponent implements OnInit {
  private srv = inject(TeacherRequestService);
  private currentUser = inject(AuthCurrentUserService);
  private dialog = inject(MatDialog);
  protected totalItems = signal(0);
  protected pageSize = signal(5);
  protected pageIndex = signal(0);
  protected pageSizeOptions = signal<number[]>([5, 10, 25]);

  public loading = signal(false);
  public requests = signal<RequestContentModel<TeacherModel>[]>([]);

  ngOnInit(): void {
    this.load();
  }

  load(filters?: UserTeacherRequestFilterValue) {
    this.loading.set(true);
    const studentId = this.currentUser.currentUserValue?.id;
    const page = this.pageIndex();
    const size = this.pageSize();
    const params = {
      ...filters,
      page,
      size,
    };
    this.srv.getByStudentId(params, studentId!).subscribe({
      next: (response: PageResponse<RequestContentModel<TeacherModel>[]>) => {
        const data = response.data;
        this.requests.set(data.content);
        this.loading.set(false);
        this.totalItems.set(data.totalElements);
        this.pageSize.set(data.size);
        this.pageIndex.set(data.number);

        const filtered = this.pageSizeOptions().filter((ps) => ps <= this.totalItems());
        this.pageSizeOptions.set(filtered);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.requests.set([]);
        }
        this.loading.set(false);
      },
    });
  }

  openCreate() {
    const ref = this.dialog.open(CreateRequestDialogComponent, { width: '640px' });
    ref.afterClosed().subscribe((result) => {
      if (result) this.goToFirstPage();
    });
  }

  onCancelled() {
    this.goToFirstPage();
  }

  onPageChange(event: any) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.load();
  }

  goToFirstPage() {
    this.pageIndex.set(0);
    this.load();
  }

  onApplyFilters(filters: UserTeacherRequestFilterValue) {
    this.pageIndex.set(0);
    this.load(filters);
  }

  onDetails(teacher: TeacherModel) {
    const ref = this.dialog.open(TeacherDetailDialog, {
      data: teacher,
      width: '680px',
      maxWidth: '80vw',
    });
    ref.afterClosed().subscribe((result) => {
      if (result) this.goToFirstPage();
    });
  }
}
