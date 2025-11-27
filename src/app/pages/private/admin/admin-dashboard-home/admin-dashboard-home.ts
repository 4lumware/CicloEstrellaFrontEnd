import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ChartOptions, ChartType, ChartDataset, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-admin-dashboard-home',
  imports: [MatCardModule, MatIconModule, MatButtonModule, BaseChartDirective],
  templateUrl: './admin-dashboard-home.html',
  styleUrl: './admin-dashboard-home.css',
})
export class AdminDashboardHome {
  // ⚡ Aquí va el ChartData
  public chartData: ChartData<'bar'> = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
    datasets: [{ data: [65, 59, 80, 81, 56, 55, 40], label: 'Usuarios Registrados' }],
  };
  public chartLabels = this.chartData.labels;

  public chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Registro de Usuarios Mensual' },
    },
  };
}
