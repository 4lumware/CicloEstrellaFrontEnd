import { Component, EventEmitter, Input, Output, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TeacherRequestService } from '../../../../../../core/services/teacher-requests/teacher-requests-service';
import { AuthCurrentUserService } from '../../../../../../core/services/users/auth/auth-current-user-service';
import { TeacherModel } from '../../../../../../core/models/teachers/teacher';

@Component({
  selector: 'app-request-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.css'],
})
export class RequestCardComponent {
  @Input() request: any;
  @Output() cancelled = new EventEmitter<void>();
  protected onDetails = output<TeacherModel>();

  private srv = inject(TeacherRequestService);
  private currentUser = inject(AuthCurrentUserService);

  public loading = signal(false);

  cancel() {
    const user = this.currentUser.currentUserValue as any;
    if (!user) return;
    this.loading.set(true);
    const requestId =
      typeof this.request.id === 'string' ? parseInt(this.request.id, 10) : this.request.id;
    const studentId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
    this.srv.destroy(requestId, studentId).subscribe({
      next: () => {
        this.loading.set(false);
        this.cancelled.emit();
      },
      error: () => this.loading.set(false),
    });
  }
  onViewDetails() {
    this.onDetails.emit(this.request.content);
  }
}
