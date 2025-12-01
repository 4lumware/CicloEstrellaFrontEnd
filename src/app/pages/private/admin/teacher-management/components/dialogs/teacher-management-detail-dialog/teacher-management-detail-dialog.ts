import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChip, MatChipsModule } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TeacherModel } from '../../../../../../../core/models/teachers/teacher';

@Component({
  selector: 'app-teacher-management-detail-dialog',

  imports: [MatCardModule, MatChipsModule, MatButtonModule, MatIconModule],
  templateUrl: './teacher-management-detail-dialog.html',
  styleUrl: './teacher-management-detail-dialog.css',
})
export class TeacherManagementDetailDialog {
  private dialogRef = inject<MatDialogRef<TeacherManagementDetailDialog>>(MatDialogRef);
  public data = inject<TeacherModel>(MAT_DIALOG_DATA);

  close(): void {
    this.dialogRef.close();
  }

  // helper methods can be added later by user
}
