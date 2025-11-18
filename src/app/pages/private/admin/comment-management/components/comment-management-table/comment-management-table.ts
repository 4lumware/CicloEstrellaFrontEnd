import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommentManagementSearchForm } from '../comment-management-search-form/comment-management-search-form';
import { CommentModel } from '../../../../../../core/models/comments/comment';
import { CommentService } from '../../../../../../core/services/comments/comment-service';
import { PageResponse } from '../../../../../../core/models/responses/response';
import { DatePipe, TitleCasePipe } from '@angular/common';

export interface PaginationState {
  pageSize: number;
  pageIndex: number;
}

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
    MatPaginatorModule,
    MatDialogModule,
    CommentManagementSearchForm,
    DatePipe,
  ],
  templateUrl: './comment-management-table.html',
  styleUrl: './comment-management-table.css',
})
export class CommentManagementTable {
  private commentService = inject(CommentService);
  private paginator = inject(MatPaginatorModule);
  protected selectedRows: WritableSignal<CommentModel[]> = signal<CommentModel[]>([]);

  protected pagination = signal<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  });

  protected pageSizeOptions: number[] = [5, 10, 25, 100];
  protected size = signal<number>(0);
  protected totalItems = signal<number>(0);
  protected displayedColumns: string[] = ['id', 'author', 'createdAt', 'actions'];
  protected dataSource: WritableSignal<CommentModel[]> = signal<CommentModel[]>([]);

  constructor() {
    effect(() => {
      this.loadComments();
    });
  }

  private loadComments(): void {
    this.commentService
      .index({ page: this.pagination().pageIndex, size: this.pagination().pageSize })
      .subscribe({
        next: (response: PageResponse<CommentModel[]>) => {
          this.size.set(response.data.size);
          this.totalItems.set(response.data.totalElements);
          console.log('API Response:', response);
          this.dataSource.set(response.data.content);
          console.log('Fetched comments:', this.dataSource);
        },
        error: (error) => {
          console.error('Error fetching comments:', error);
        },
      });
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
    console.log('Current selected rows:', this.selectedRows());
  }

  onPageChange(event: any): void {
    this.pagination.set({
      pageSize: event.pageSize,
      pageIndex: event.pageIndex,
    });
  }

  deleteSelected(): void {
    const selected = this.selectedRows();
    console.log('Deleting selected comments:', selected);
  }
}
