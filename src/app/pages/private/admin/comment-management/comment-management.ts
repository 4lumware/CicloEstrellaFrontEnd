import { Component, inject } from '@angular/core';
import { CommentManagementSearchForm } from './components/comment-management-search-form/comment-management-search-form';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommentManagementTable } from './components/comment-management-table/comment-management-table';

@Component({
  selector: 'app-comment-management',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatDialogModule,
    CommentManagementTable,
  ],
  templateUrl: './comment-management.html',
  styleUrl: './comment-management.css',
})
export class CommentManagement {}
