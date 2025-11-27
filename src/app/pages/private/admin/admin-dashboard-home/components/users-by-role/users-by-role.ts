import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { ApiResponse } from '../../../../../../core/models/responses/response';
import { CharData } from '../../../../../../core/models/dashboard/dashboard';
import { DashboardService } from '../../../../../../core/services/dashboard/dashboard-service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-users-by-role',
  imports: [BaseChartDirective, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './users-by-role.html',
  styleUrl: './users-by-role.css',
})
export class UsersByRole implements OnInit {
  private srv = inject(DashboardService);
  protected loading = signal<boolean>(false);
  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
  };

  public chartType: ChartType = 'pie';

  public chartData: ChartData = { labels: [], datasets: [] };

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.srv.usersByRole().subscribe({
      next: (res: ApiResponse<CharData>) => {
        const d: any = res.data;
        const labels = d.labels ?? d.label ?? [];
        const values = d.values ?? d.data ?? d.datasets?.[0]?.data ?? [];
        this.chartData = {
          labels: [...labels],
          datasets: [
            {
              label: 'Estudiantes',
              data: [...values],
              hoverOffset: 4,
            },
          ],
        };
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
