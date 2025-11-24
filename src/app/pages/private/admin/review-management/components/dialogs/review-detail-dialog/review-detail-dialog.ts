import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { ReviewModel } from '../../../../../../../core/models/reviews/review';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-review-detail-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    DatePipe,
  ],
  templateUrl: './review-detail-dialog.html',
  styleUrls: ['./review-detail-dialog.css'],
})
export class ReviewDetailDialog {
  private dialogRef = inject<MatDialogRef<ReviewDetailDialog>>(MatDialogRef);
  public data = inject<ReviewModel>(MAT_DIALOG_DATA);
  protected stars = [0, 1, 2, 3, 4];

  close(): void {
    this.dialogRef.close();
  }

  /**
   * Returns the icon name for a star position based on rating (0-5).
   * Uses Material icons: 'star', 'star_half', 'star_border'
   */
  starIcon(position: number): 'star' | 'star_half' | 'star_border' {
    const rating = this.data?.rating ?? 0;
    const diff = rating - position;
    if (diff >= 1) return 'star';
    if (diff > 0 && diff < 1) return 'star_half';
    return 'star_border';
  }

  /**
   * Safe image URL for reaction; if not present returns placeholder data URL
   */
  reactionImg(reaction: { icon_url?: string }) {
    return (
      reaction?.icon_url || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
    );
  }

  teacherFullName(): string {
    const t = this.data?.teacher;
    if (!t) return '-';
    const first = t.firstName || '';
    const last = t.lastName || '';
    return `${first}${last ? ' ' + last : ''}`.trim() || '-';
  }

  tagColor(tagName: string | undefined): 'primary' | 'accent' | 'warn' | undefined {
    if (!tagName) return undefined;
    const first = tagName.trim().charAt(0).toLowerCase();
    if (first === 'c') return 'primary';
    if (first === 'i') return 'accent';
    if (first === 'e') return 'warn';
    return undefined;
  }
}
