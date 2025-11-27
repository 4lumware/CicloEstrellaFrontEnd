import { Component, OnInit, inject, signal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartData, ChartType } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiResponse } from '../../../../../../core/models/responses/response';
import { CharData } from '../../../../../../core/models/dashboard/dashboard';
import { DashboardService } from '../../../../../../core/services/dashboard/dashboard-service';

@Component({
  selector: 'app-registrations-chart',
  imports: [BaseChartDirective, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './registrations-chart.html',
  styleUrls: ['./registrations-chart.css'],
})
export class RegistrationsChart implements OnInit {
  private srv = inject(DashboardService);
  protected loading = signal<boolean>(false);

  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
  };

  public chartType: ChartType = 'line';
  public chartData: ChartData = { labels: [], datasets: [] };

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.srv.registrationsByMonth().subscribe({
      next: (res: ApiResponse<CharData>) => {
        console.log(res);
        const d: any = res.data;
        const datasets = d.datasets ?? [];
        const labels = d.labels ?? d.label ?? [];

        const datasetsConfig = datasets.map((ds: any) => ({
          ...ds,
          fill: true,
          tension: 0.19,
        }));
        this.chartData = {
          labels: [...labels],
          datasets: [...datasetsConfig],
        };
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
