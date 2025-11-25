import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TeacherRequestsTable } from './components/teacher-requests-table/teacher-requests-table';

@Component({
  selector: 'app-teacher-requests-management',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    TeacherRequestsTable,
  ],
  templateUrl: './teacher-requests-management.html',
  styleUrl: './teacher-requests-management.css',
})
export class TeacherRequestsManagement {}
