import { Component, inject, signal } from '@angular/core';
import { sign } from 'chart.js/helpers';
import { ReviewModel } from '../../../../../../core/models/reviews/review';
import { DashboardService } from '../../../../../../core/services/dashboard/dashboard-service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-last-comments-chart',
  imports: [MatCardModule, MatProgressSpinnerModule, MatIconModule, DatePipe, MatDividerModule],
  templateUrl: './last-comments-chart.html',
  styleUrl: './last-comments-chart.css',
})
export class LastCommentsChart {
  protected reviews = signal<ReviewModel[]>([]);
  protected loading = signal<boolean>(false);
  protected limit = signal<number>(3);
  private service = inject(DashboardService);
  constructor() {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.service.lastReviews(this.limit()).subscribe({
      next: (res) => {
        this.reviews.set(res.data);
        this.loading.set(false);
      },
    });
  }
}
