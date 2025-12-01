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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  CommentFilterForm,
  CommentFilterFormValue,
  CommentManagementSearchForm,
} from '../comment-management-search-form/comment-management-search-form';
import { CommentModel } from '../../../../../../core/models/comments/comment';
import { CommentService } from '../../../../../../core/services/comments/comment-service';
import { PageResponse } from '../../../../../../core/models/responses/response';
import { DatePipe } from '@angular/common';
import { CommentDetailDialog } from './dialogs/comment-detail-dialog/comment-detail-dialog';
import { ConfirmDialog } from '../../../../../../shared/components/ui/confirm-dialog/confirm-dialog';
import { forkJoin } from 'rxjs';
import { SharedPaginator } from '../../../../../../shared/components/ui/shared-paginator/shared-paginator';
import { SnackbarNotificationService } from '../../../../../../core/services/notifications/snackbar-notification-service';

export interface PaginationState {
  pageSize: number;
  pageIndex: number;
}

export interface CommentFilter {}
@Component({
  selector: 'app-comment-management-table',
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    CommentManagementSearchForm,
    DatePipe,
    SharedPaginator,
  ],
  templateUrl: './comment-management-table.html',
  styleUrl: './comment-management-table.css',
})
export class CommentManagementTable implements AfterViewInit {
  private commentService = inject(CommentService);
  private dialog = inject(MatDialog);
  protected snackBar: SnackbarNotificationService = inject(SnackbarNotificationService);
  protected selectedRows: WritableSignal<CommentModel[]> = signal<CommentModel[]>([]);
  protected size = signal<number>(0);
  protected totalItems = signal<number>(0);
  protected displayedColumns: string[] = ['id', 'author', 'formalityTitle', 'createdAt', 'actions'];
  protected dataSource: WritableSignal<CommentModel[]> = signal<CommentModel[]>([]);
  protected isRefreshing: WritableSignal<boolean> = signal<boolean>(false);
  private refreshStartedAt: number | null = null;
  protected filters: WritableSignal<CommentFilterFormValue> = signal<CommentFilterFormValue>({
    keyword: '',
    studentName: '',
    formalityTitle: '',
    from: null,
    to: null,
  });

  private paginator = viewChild(SharedPaginator);

  onPageChange(event: any): void {
    this.loadComments();
  }

  onSearchApply(filters: CommentFilterFormValue): void {
    this.filters.set(filters);
    this.loadComments();
  }

  onSearchClear(): void {
    this.filters.set({
      keyword: '',
      studentName: '',
      formalityTitle: '',
      from: null,
      to: null,
    });
    this.loadComments();
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    Promise.resolve().then(() => this.loadComments());
  }

  openDetail(comment: CommentModel): void {
    this.dialog.open(CommentDetailDialog, {
      data: comment,
      width: '560px',
      maxWidth: '90vw',
      autoFocus: false,
    });
  }

  public loadComments(): void {
    const pIndex = this.paginator()?.currentPageIndex ?? 0;
    const pSize = this.paginator()?.currentPageSize ?? 5;

    this.isRefreshing.set(true);
    this.refreshStartedAt = Date.now();
    const params: any = {
      page: pIndex,
      size: pSize,
    };

    const f = this.filters();
    if (f) {
      if (f.keyword) params.keyword = f.keyword;
      if (f.studentName) params.studentName = f.studentName;
      if (f.formalityTitle) params.formalityTitle = f.formalityTitle;
      if (f.from) params.from = f.from instanceof Date ? f.from.toISOString() : f.from;
      if (f.to) params.to = f.to instanceof Date ? f.to.toISOString() : f.to;
    }

    this.commentService.index(params).subscribe({
      next: (response: PageResponse<CommentModel[]>) => {
        this.size.set(response.data.size);
        this.totalItems.set(response.data.totalElements);
        this.dataSource.set(response.data.content);
        this.completeRefreshing();
      },
      error: (error) => {
        const errorMsg = error?.error?.message || 'Error fetching comments';
        this.snackBar.error(errorMsg);
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

  isSelected(row: CommentModel): boolean {
    return this.selectedRows().some((selected) => selected.id === row.id);
  }

  onRowClick(row: CommentModel): void {
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
        message: `¿Estás seguro de que deseas eliminar ${selected.length} comentario(s) seleccionado(s)?`,
        confirmLabel: 'Eliminar',
        cancelLabel: 'Cancelar',
        icon: 'delete_sweep',
        color: 'warn',
      },
    });

    ref.afterClosed().subscribe((ok) => {
      if (!ok) return;

      const valid = selected.filter(
        (c) => c.formality && (c.formality as any).idFormality !== undefined
      );
      if (valid.length === 0) {
        this.snackBar.error(
          'No se pudieron identificar las formalities de los comentarios seleccionados'
        );
        return;
      }

      const ops = valid.map((c) =>
        this.commentService.destroy((c.formality as any).idFormality, c.id)
      );

      forkJoin(ops).subscribe({
        next: () => {
          this.selectedRows.set([]);
          this.loadComments();
          this.snackBar.success(`${valid.length} comentario(s) eliminados`);
        },
        error: (err) => {
          console.error('Error deleting comments:', err);
          this.snackBar.error('Error al eliminar comentarios');
        },
      });
    });
  }

  onDeleteComment(comment: CommentModel): void {
    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Eliminar comentario',
        message: `¿Estás seguro de que deseas eliminar el comentario de ${
          comment.author?.username || 'este usuario'
        }?`,
        confirmLabel: 'Eliminar',
        cancelLabel: 'Cancelar',
        icon: 'delete',
        color: 'warn',
      },
    });

    ref.afterClosed().subscribe((ok) => {
      if (!ok) return;

      const formalityId = (comment.formality as any)?.idFormality;
      if (!formalityId) {
        this.snackBar.error('No se pudo identificar la formality del comentario');
        return;
      }

      this.commentService.destroy(formalityId, comment.id).subscribe({
        next: () => {
          this.snackBar.success('Comentario eliminado');
          this.loadComments();
        },
        error: (err) => {
          console.error('Error deleting comment:', err);
          this.snackBar.error('Error al eliminar comentario');
        },
      });
    });
  }
}
