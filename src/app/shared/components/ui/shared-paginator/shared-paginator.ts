import { Component, computed, effect, forwardRef, input, output, signal } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PaginationState } from '../../../../pages/private/admin/comment-management/components/comment-management-table/comment-management-table';

@Component({
  selector: 'app-shared-paginator',
  imports: [MatPaginatorModule],
  templateUrl: './shared-paginator.html',
  styleUrl: './shared-paginator.css',
  providers: [
    {
      provide: MatPaginator,
      useExisting: forwardRef(() => SharedPaginator),
    },
  ],
})
export class SharedPaginator {
  public length = input<number>(0);
  public pageSize = input<number>(5);
  public pageIndex = input<number>(0);
  public allPageSizeOptions = input<number[]>([5, 10, 25, 50, 100]);
  protected paginator = signal<PaginationState>({
    pageSize: this.pageSize(),
    pageIndex: this.pageIndex(),
  });
  public page = output<PageEvent>();

  public effectivePageSizeOptions = computed(() => {
    const total = this.length();
    const opts = this.allPageSizeOptions();

    if (!total) return opts;

    const filtered = opts.filter((o) => o <= total);

    return filtered.length ? filtered : [total];
  });

  onPage(e: PageEvent): void {
    this.paginator.set({
      pageIndex: e.pageIndex,
      pageSize: e.pageSize,
    });
    this.page.emit(e);
  }

  goToFirstPage(): void {
    this.paginator.set({
      ...this.paginator(),
      pageIndex: 0,
    });
  }

  get currentPageIndex(): number {
    return this.paginator().pageIndex;
  }

  get currentPageSize(): number {
    return this.paginator().pageSize;
  }
}
