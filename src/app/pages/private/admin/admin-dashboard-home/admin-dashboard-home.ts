import { Component, signal, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { KpiCard } from './components/kpi-card/kpi-card';
import { RegistrationsChart } from './components/registrations-chart/registrations-chart';
import { AvgRatingChart } from './components/avg-rating-chart/avg-rating-chart';
import { StudentsByCareer } from './components/students-by-career/students-by-career';
import { UsersByRole } from './components/users-by-role/users-by-role';
import { DashboardService } from '../../../../core/services/dashboard/dashboard-service';
import { DashboardKPIs, KPIItem } from '../../../../core/models/dashboard/dashboard';

@Component({
  selector: 'app-admin-dashboard-home',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    KpiCard,
    RegistrationsChart,
    AvgRatingChart,
    StudentsByCareer,
    UsersByRole,
  ],
  templateUrl: './admin-dashboard-home.html',
  styleUrl: './admin-dashboard-home.css',
})
export class AdminDashboardHome implements OnInit {
  private srv = inject(DashboardService);
  protected loading = signal<boolean>(true);
  protected kpiNewRegistrations = signal<KPIItem | null>(null);
  protected kpiAvgRating = signal<KPIItem | null>(null);
  protected kpiNewReviews = signal<KPIItem | null>(null);

  ngOnInit(): void {
    this.srv.getKPIs().subscribe({
      next: (res: DashboardKPIs) => {
        this.kpiNewRegistrations.set({
          value: res.newRegistrationsLast7Days.value,
          trend: res.newRegistrationsLast7Days.trend,
          changePercent: res.newRegistrationsLast7Days.changePercent,
        });

        this.kpiAvgRating.set({
          value: res.avgRatingLast30Days.value,
          trend: res.avgRatingLast30Days.trend,
          changePercent: res.avgRatingLast30Days.changePercent,
        });

        this.kpiNewReviews.set({
          value: res.newReviewsLastNDays.value,
          trend: res.newReviewsLastNDays.trend,
          changePercent: res.newReviewsLastNDays.changePercent,
        });

        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
