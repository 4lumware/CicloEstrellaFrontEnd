import {
  AfterViewInit,
  Component,
  effect,
  inject,
  signal,
  computed,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  ReviewFilterForm,
  ReviewFilterFormValue,
  ReviewManagementSearchForm,
} from '../review-management-search-form/review-management-search-form';
import { ReviewModel, ReviewParamsFilter } from '../../../../../../core/models/reviews/review';
import { PageResponse } from '../../../../../../core/models/responses/response';
import { DatePipe } from '@angular/common';
import { ReviewDetailDialog } from '../dialogs/review-detail-dialog/review-detail-dialog';
import { ConfirmDialog } from '../../../../../../shared/components/ui/confirm-dialog/confirm-dialog';
import { forkJoin } from 'rxjs';
import { SharedPaginator } from '../../../../../../shared/components/ui/shared-paginator/shared-paginator';
import { ReviewService } from '../../../../../../core/services/reviews/review-service';
import { MatChipSet, MatChip, MatChipsModule } from '@angular/material/chips';

export interface PaginationState {
  pageSize: number;
  pageIndex: number;
}

export interface ReviewFilter {}
@Component({
  selector: 'app-review-management-table',
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    ReviewManagementSearchForm,
    DatePipe,
    SharedPaginator,
    MatChipsModule,
  ],
  templateUrl: './review-management-table.html',
  styleUrl: './review-management-table.css',
})
export class ReviewManagementTable implements AfterViewInit {
  private reviewService = inject(ReviewService);
  private dialog = inject(MatDialog);
  protected snackBar: MatSnackBar = inject(MatSnackBar);
  protected selectedRows: WritableSignal<ReviewModel[]> = signal<ReviewModel[]>([]);
  protected size = signal<number>(0);
  protected totalItems = signal<number>(0);
  protected displayedColumns: string[] = [
    'id',
    'author',
    'teacherName',
    'rating',
    'tags',
    'createdAt',
    'actions',
  ];
  protected dataSource: WritableSignal<ReviewModel[]> = signal<ReviewModel[]>([]);
  protected isRefreshing: WritableSignal<boolean> = signal<boolean>(false);
  private refreshStartedAt: number | null = null;
  protected filters: WritableSignal<ReviewParamsFilter> = signal<ReviewParamsFilter>({
    keyword: '',
    studentName: '',
    studentId: null,
    teacherId: null,
    teacherName: '',
    minRating: null,
    maxRating: null,
    tagId: null,
    tagName: '',
    from: null,
    to: null,
  });

  private paginator = viewChild(SharedPaginator);

  onPageChange(event: any): void {
    this.loadReviews();
  }

  onSearchApply(filters: ReviewFilterFormValue): void {
    this.filters.set(filters);
    this.loadReviews();
  }

  onSearchClear(): void {
    this.filters.set({
      keyword: '',
      studentName: '',
      studentId: null,
      teacherId: null,
      teacherName: '',
      minRating: null,
      maxRating: null,
      tagId: null,
      tagName: '',
      from: null,
      to: null,
    });
    this.loadReviews();
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    Promise.resolve().then(() => this.loadReviews());
  }

  openDetail(comment: ReviewModel): void {
    this.dialog.open(ReviewDetailDialog, {
      data: comment,
      width: '560px',
      maxWidth: '90vw',
      autoFocus: false,
    });
  }

  public loadReviews(): void {
    const pIndex = this.paginator()?.currentPageIndex ?? 0;
    const pSize = this.paginator()?.currentPageSize ?? 5;

    this.isRefreshing.set(true);
    this.refreshStartedAt = Date.now();
    const params: any = {
      page: pIndex,
      size: pSize,
    };

    const f = this.filters();
    console.log('Applying filters:', f);
    if (f) {
      if (f.keyword) params.keyword = f.keyword;
      if (f.studentName) params.studentName = f.studentName;
      if (f.studentId !== null && f.studentId !== undefined) params.studentId = f.studentId;
      if (f.teacherId !== null && f.teacherId !== undefined) params.teacherId = f.teacherId;
      if (f.teacherName) params.teacherName = f.teacherName;
      if (f.minRating !== null && f.minRating !== undefined) params.minRating = f.minRating;
      if (f.maxRating !== null && f.maxRating !== undefined) params.maxRating = f.maxRating;
      if (f.tagId !== null && f.tagId !== undefined) params.tagId = f.tagId;
      if (f.tagName) params.tagName = f.tagName;
      if (f.from) params.from = f.from instanceof Date ? f.from.toISOString() : f.from;
      if (f.to) params.to = f.to instanceof Date ? f.to.toISOString() : f.to;
    }

    this.reviewService.index(params).subscribe({
      next: (response: PageResponse<ReviewModel[]>) => {
        this.size.set(response.data.size);
        this.totalItems.set(response.data.totalElements);
        this.dataSource.set(response.data.content);
        console.log('Reviews loaded:', response.data.content);
        this.completeRefreshing();
      },
      error: (error) => {
        const errorMsg = error?.error?.message || 'Error fetching reviews';
        this.snackBar.open(errorMsg, 'Cerrar', { duration: 3000 });
        this.dataSource.set([]);
        this.completeRefreshing();
      },
    });
  }

  private completeRefreshing(): void {
    const minMs = 1000;
    const started = this.refreshStartedAt ?? 0;
    const elapsed = Date.now() - started;
    const remaining = minMs - elapsed;
    this.refreshStartedAt = null;
    if (remaining > 0) {
      setTimeout(() => this.isRefreshing.set(false), remaining);
    } else {
      this.isRefreshing.set(false);
    }
  }

  isSelected(row: ReviewModel): boolean {
    return this.selectedRows().some((selected) => selected.id === row.id);
  }

  onRowClick(row: ReviewModel): void {
    const currentSelected = this.selectedRows();

    if (this.isSelected(row)) {
      this.selectedRows.set(currentSelected.filter((selected) => selected.id !== row.id));
    } else {
      this.selectedRows.set([...currentSelected, row]);
    }
  }

  deleteSelected(): void {
    const selected = this.selectedRows();
    if (!selected || selected.length === 0) return;

    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Eliminar seleccionados',
        message: `¿Estás seguro de que deseas eliminar ${selected.length} review(s) seleccionado(s)?`,
        confirmLabel: 'Eliminar',
        cancelLabel: 'Cancelar',
        icon: 'delete_sweep',
        color: 'warn',
      },
    });

    ref.afterClosed().subscribe((ok) => {
      if (!ok) return;

      const ops = selected.map((c) => this.reviewService.destroy(c.id));

      forkJoin(ops).subscribe({
        next: () => {
          this.selectedRows.set([]);
          this.loadReviews();
          this.snackBar.open(`${selected.length} review(s) eliminados`, 'Cerrar', {
            duration: 3000,
          });
        },
        error: (err) => {
          console.error('Error deleting reviews:', err);
          this.snackBar.open('Error al eliminar reviews', 'Cerrar', { duration: 3000 });
        },
      });
    });
  }

  onDeleteReview(review: ReviewModel): void {
    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Eliminar review',
        message: `¿Estás seguro de que deseas eliminar la review de ${
          review.student.username || 'este usuario'
        }?`,
        confirmLabel: 'Eliminar',
        cancelLabel: 'Cancelar',
        icon: 'delete',
        color: 'warn',
      },
    });

    ref.afterClosed().subscribe((ok) => {
      if (!ok) return;

      this.reviewService.destroy(review.id).subscribe({
        next: () => {
          this.snackBar.open('Review eliminado', 'Cerrar', { duration: 3000 });
          this.loadReviews();
        },
        error: (err) => {
          console.error('Error deleting review:', err);
          this.snackBar.open('Error al eliminar review', 'Cerrar', { duration: 3000 });
        },
      });
    });
  }

  teacherName(review: ReviewModel): string {
    if (!review?.teacher) return '-';
    const first = review.teacher.firstName || '';
    const last = review.teacher.lastName || '';
    const full = `${first}${last ? ' ' + last : ''}`.trim();
    return full || '-';
  }

  tagsToString(review: ReviewModel): string {
    if (!review?.tags || review.tags.length === 0) return '-';
    return review.tags.map((t) => t.tagName).join(', ');
  }

  tagColor(tagName: string | undefined): 'primary' | 'accent' | 'warn' | undefined {
    if (!tagName) return undefined;
    const first = tagName.trim().charAt(0).toLowerCase();
    if (first === 'c') return 'primary';
    if (first === 'i') return 'accent';
    if (first === 'e') return 'warn';
    return undefined;
  }
}
