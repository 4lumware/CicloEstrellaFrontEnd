import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { TeacherModel } from '../../../../../../../core/models/teachers/teacher';

@Component({
  selector: 'app-teacher-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
  ],
  templateUrl: './teacher-detail-dialog.html',
  styleUrls: ['./teacher-detail-dialog.css'],
})
export class TeacherDetailDialog {
  constructor(
    public dialogRef: MatDialogRef<TeacherDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  // attempt to find the teacher object inside the dialog data
  get teacher(): TeacherModel | null {
    if (!this.data) return null;
    // if the payload is a request-like object, try content
    if (this.data.content) {
      const c = Array.isArray(this.data.content) ? this.data.content[0] : this.data.content;
      return (c as TeacherModel) ?? null;
    }
    // otherwise assume data is a teacher
    return (this.data as TeacherModel) ?? null;
  }

  fullName(): string {
    const t = this.teacher;
    if (!t) return '-';
    return `${t.firstName || ''}${t.lastName ? ' ' + t.lastName : ''}`.trim();
  }

  // stars indices for 5-star display
  starArray(): number[] {
    return [0, 1, 2, 3, 4];
  }

  // original rating if present in the request payload (1-10 scale)
  originalRating(): number | null {
    if (!this.data) return null;
    // check at top-level
    const top = this.data.rating ?? this.data.requestRating ?? this.data.score ?? null;
    if (top != null && !isNaN(Number(top))) return Number(top);
    // check inside content
    if (this.data.content) {
      const c = Array.isArray(this.data.content) ? this.data.content[0] : this.data.content;
      const inner = c?.rating ?? c?.score ?? null;
      if (inner != null && !isNaN(Number(inner))) return Number(inner);
    }
    return null;
  }

  // normalized rating in 0-5 scale (float), or null if none
  normalizedRating(): number | null {
    const orig = this.originalRating();
    if (orig == null) return null;
    // if given 1-10, convert to 0-5
    if (orig > 5) return orig / 2;
    return orig;
  }

  // compute icon for star position
  starIcon(position: number): 'star' | 'star_half' | 'star_border' {
    const nr = this.normalizedRating() ?? 0;
    const diff = nr - position;
    if (diff >= 1) return 'star';
    if (diff > 0 && diff < 1) return 'star_half';
    return 'star_border';
  }

  // image error fallback
  onImgError(event: any): void {
    try {
      const img = event?.target as HTMLImageElement;
      if (!img) return;
      const placeholder = '/assets/images/avatar-placeholder.png';
      // if already using placeholder or fallback was set, avoid looping
      if (!img.src || img.src.includes('avatar-placeholder.png')) return;
      // disable further error handling to prevent cycles
      img.onerror = null;
      img.dataset['fallbackSet'] = '1';
      img.src = placeholder;
    } catch (_e) {
      // ignore
    }
  }
}
