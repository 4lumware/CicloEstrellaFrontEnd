import { Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { KPITrend } from '../../../../../../core/models/dashboard/dashboard';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.css',
})
export class KpiCard {
  label = input<string>('');
  value = input<number | string>(0);
  changePercent = input<number | null>(null);
  trend = input<KPITrend>('neutral');
}
