import {Component, effect, input, output, signal} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-shared-paginator-teachers',
  imports: [
    MatPaginator
  ],
  templateUrl: './shared-paginator-teachers.html',
  styleUrl: './shared-paginator-teachers.css',
})
export class SharedPaginatorTeachers {
// Inputs
  public length = input<number>(0);
  public pageSize = input<number>(10);
  public pageIndex = input<number>(0);
  public pageSizeOptions = input<number[]>([5, 10, 25, 50]);

  // Output
  public page = output<PageEvent>();

  // Estado interno sincronizado con inputs
  protected currentPageIndex = signal<number>(0);
  protected currentPageSize = signal<number>(10);

  constructor() {
    // Sincronizar con inputs cuando cambien
    effect(() => {
      this.currentPageIndex.set(this.pageIndex());
      this.currentPageSize.set(this.pageSize());
    });
  }

  // Computed para opciones de página filtradas
  public effectivePageSizeOptions = () => {
    const total = this.length();
    const opts = this.pageSizeOptions();

    if (!total || total === 0) return opts;

    const filtered = opts.filter((o) => o <= total);
    return filtered.length ? filtered : [Math.min(total, opts[0] || 10)];
  };

  onPage(e: PageEvent): void {
    this.currentPageIndex.set(e.pageIndex);
    this.currentPageSize.set(e.pageSize);
    this.page.emit(e);
  }

  // Método público para resetear a primera página
  goToFirstPage(): void {
    this.currentPageIndex.set(0);
  }

  // Getters públicos
  get pageIndexValue(): number {
    return this.currentPageIndex();
  }

  get pageSizeValue(): number {
    return this.currentPageSize();
  }
}
