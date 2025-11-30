import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartData, ChartType } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiResponse } from '../../../../../../core/models/responses/response';
import { CharData } from '../../../../../../core/models/dashboard/dashboard';
import { DashboardService } from '../../../../../../core/services/dashboard/dashboard-service';

@Component({
  selector: 'app-avg-rating-chart',
  standalone: true,
  imports: [BaseChartDirective, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './avg-rating-chart.html',
  styleUrls: ['./avg-rating-chart.css'],
})
export class AvgRatingChart implements OnInit {
  private srv = inject(DashboardService);
  protected loading = signal<boolean>(false);

  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
  };

  public chartType: ChartType = 'bar';
  public chartData: ChartData = { labels: [], datasets: [] };

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.srv.avgRatingPerTeacher().subscribe({
      next: (res: ApiResponse<CharData>) => {
        const d: any = res.data;
        const labels = d.labels ?? d.label ?? [];
        const values = d.values ?? d.data ?? d.datasets?.[0]?.data ?? [];

        this.chartData = {
          labels: [...labels],
          datasets: [
            {
              label: 'Promedio',
              data: [...values],
              type: 'bar',
              borderWidth: 1,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              indexAxis: 'y',
            },
          ],
        } as any;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
