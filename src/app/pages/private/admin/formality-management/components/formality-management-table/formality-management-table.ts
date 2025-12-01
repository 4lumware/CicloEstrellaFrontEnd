import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  ViewChild,
  output,
  viewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedPaginator } from '../../../../../../shared/components/ui/shared-paginator/shared-paginator';
import { FormalityManagementSearchForm } from '../formality-management-search-form/formality-management-search-form';
import { FormalityService } from '../../../../../../core/services/formalities/formality-service';
import {
  FormalityModel,
  FormalityParamsFilter,
} from '../../../../../../core/models/formalities/formality';
import { signal } from '@angular/core';
import { Form } from '@angular/forms';
import { PageResponse } from '../../../../../../core/models/responses/response';
import { from } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarNotificationService } from '../../../../../../core/services/notifications/snackbar-notification-service';

@Component({
  selector: 'app-formality-management-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule,
    SharedPaginator,
    FormalityManagementSearchForm,
  ],
  templateUrl: './formality-management-table.html',
  styleUrls: ['./formality-management-table.css'],
})
export class FormalityManagementTable implements OnInit {
  protected formalityDelete = output<FormalityModel>();
  protected formalityUpdate = output<FormalityModel>();
  protected formalityDeleteMultiple = output<FormalityModel[]>();

  protected displayedColumns = ['id', 'title', 'startDate', 'endDate', 'actions'];
  protected data = signal<FormalityModel[]>([]);
  protected isRefreshing = signal(false);

  protected selectedRows = signal<FormalityModel[]>([]);
  protected paginator = viewChild(SharedPaginator);
  protected size = signal<number>(0);
  protected totalItems = signal<number>(0);
  protected filters = signal<FormalityParamsFilter>({
    title: '',
    description: '',
    from: null,
    to: null,
  });

  private formalityService = inject(FormalityService);
  private snackBar = inject(SnackbarNotificationService);

  ngOnInit(): void {
    this.loadRequests();
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
    this.filters.set({ title: '', description: '', from: null, to: null });
    this.loadRequests(0);
    this.paginator()?.goToFirstPage();
  }

  setRefreshing(value: boolean): void {
    this.isRefreshing.set(value);
  }

  loadRequests(pageIndex = 0, pageSize = 5): void {
    const pIndex = pageIndex ?? this.paginator()?.currentPageIndex ?? 0;
    const pSize = pageSize ?? this.paginator()?.currentPageSize ?? 5;

    const spinnerMinMs = 1000;
    const start = Date.now();
    this.isRefreshing.set(true);
    const params: any = {
      page: pIndex,
      size: pSize,
      ...this.filters(),
      from: this.filters().from?.toISOString() ?? null,
      to: this.filters().to?.toISOString() ?? null,
    };

    console.log('Cargando trámites con parámetros:', params);
    this.formalityService.index(params).subscribe({
      next: (res: PageResponse<FormalityModel[]>) => {
        const data = res.data;
        this.data.set(data.content ?? data ?? []);
        this.totalItems.set(data.totalElements ?? 0);
        this.size.set(data.size ?? pSize);
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, spinnerMinMs - elapsed);
        setTimeout(() => this.isRefreshing.set(false), remaining);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.data.set([]);
          this.size.set(0);
          this.totalItems.set(0);
          const elapsed = Date.now() - start;
          const remaining = Math.max(0, spinnerMinMs - elapsed);
          setTimeout(() => this.isRefreshing.set(false), remaining);
          this.snackBar.error('No se encontraron trámites');
          return;
        }

        this.snackBar.error('Error cargando trámites');
        this.data.set([]);
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, spinnerMinMs - elapsed);
        setTimeout(() => this.isRefreshing.set(false), remaining);
      },
    });
  }

  toggleRowSelection(row: FormalityModel, checked: boolean): void {
    const current = this.selectedRows();
    if (checked) {
      this.selectedRows.set([...current, row]);
    } else {
      this.selectedRows.set(current.filter((r) => r.idFormality !== row.idFormality));
    }
  }

  isSelected(row: FormalityModel): boolean {
    return this.selectedRows().some(function (r) {
      return r.idFormality === row.idFormality;
    });
  }

  toggleSelectAll(checked: boolean): void {
    if (checked) {
      this.selectedRows.set(this.data());
    } else {
      this.selectedRows.set([]);
    }
  }

  deleteSelected(): void {
    const items = this.selectedRows();
    if (items.length === 0) return;
    this.formalityDeleteMultiple.emit(items);
  }

  onDelete(item: FormalityModel): void {
    this.formalityDelete.emit(item);
  }

  onUpdate(item: FormalityModel): void {
    this.formalityUpdate.emit(item);
  }
}
