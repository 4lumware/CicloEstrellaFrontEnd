import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

export interface AddFavoriteDialogData {
  title: string;
  type: 'TEACHER' | 'FORMALITY';
}

@Component({
  selector: 'app-add-favorite-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p class="dialog-description">
        ¿Desea guardar este
        {{ data.type === 'TEACHER' ? 'profesor' : 'trámite' }}?
      </p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSave()">
        Guardar en Biblioteca
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
      }

      mat-dialog-content {
        min-width: 400px;
        padding: 20px 24px;
      }

      .dialog-description {
        color: #666;
        font-size: 0.95em;
        margin-bottom: 20px;
        line-height: 1.5;
      }

      mat-dialog-actions {
        padding: 16px 24px;
        gap: 12px;
      }

      h2 {
        color: #4b2c5e;
        font-weight: 600;
      }

      button[mat-raised-button] {
        background-color: #ffcb47 !important;
        color: #4b2c5e !important;
        font-weight: 600;
      }

      button[mat-raised-button]:hover {
        background-color: #ffc107 !important;
      }

      @media (max-width: 600px) {
        mat-dialog-content {
          min-width: 300px;
        }
      }
    `,
  ],
})
export class AddFavoriteDialog {
  dialogRef = inject(MatDialogRef<AddFavoriteDialog>);
  data = inject<AddFavoriteDialogData>(MAT_DIALOG_DATA);

  note: string = '';

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.note.trim());
  }
}
