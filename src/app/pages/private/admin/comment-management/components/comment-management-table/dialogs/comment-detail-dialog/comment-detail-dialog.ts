import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommentModel } from '../../../../../../../../core/models/comments/comment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-comment-detail-dialog',
  imports: [MatCardModule, MatButtonModule, DatePipe],
  templateUrl: './comment-detail-dialog.html',
  styleUrls: ['./comment-detail-dialog.css'],
})
export class CommentDetailDialog {
  private dialogRef = inject<MatDialogRef<CommentDetailDialog>>(MatDialogRef);
  public data = inject<CommentModel>(MAT_DIALOG_DATA);

  close(): void {
    this.dialogRef.close();
  }
}
