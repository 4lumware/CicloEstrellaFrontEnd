import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReviewManagementTable } from './components/review-management-table/review-management-table';

@Component({
  selector: 'app-review-management',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatDialogModule,
    ReviewManagementTable,
  ],
  templateUrl: './review-management.html',
  styleUrl: './review-management.css',
})
export class ReviewManagement {}
