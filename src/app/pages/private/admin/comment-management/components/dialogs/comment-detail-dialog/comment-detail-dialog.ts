import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { CommentModel } from '../../../../../../../core/models/comments/comment';

@Component({
  selector: 'app-comment-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './comment-detail-dialog.html',
  styleUrls: ['./comment-detail-dialog.css'],
})
export class CommentDetailDialog {
  constructor(
    public dialogRef: MatDialogRef<CommentDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CommentModel
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
