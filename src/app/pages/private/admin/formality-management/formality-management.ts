import { Component, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormalityManagementTable } from './components/formality-management-table/formality-management-table';
import { FormalityCreateDialog } from './components/dialogs/formality-create-dialog/formality-create-dialog';
import { FormalityUpdateDialog } from './components/dialogs/formality-update-dialog/formality-update-dialog';
import { ConfirmDialog } from '../../../../shared/components/ui/confirm-dialog/confirm-dialog';
import { FormalityModel } from '../../../../core/models/formalities/formality';
import { FormalityService } from '../../../../core/services/formalities/formality-service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-formality-management',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatDialogModule,
    FormalityManagementTable,
  ],
  templateUrl: './formality-management.html',
  styleUrls: ['./formality-management.css'],
})
export class FormalityManagement {
  private tableComponent = viewChild(FormalityManagementTable);
  private dialog = inject(MatDialog);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private service = inject(FormalityService);

  onAddFormality(): void {
    const ref = this.dialog.open(FormalityCreateDialog, { width: '640px', maxHeight: '90vh' });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      const table = this.tableComponent();
      if (!table) return;

      this.service.store(result).subscribe({
        next: () => {
          this.snackBar.open('Trámite creado', 'Cerrar', { duration: 3000 });
          table.loadRequests();
        },
        error: () => this.snackBar.open('Error creando trámite', 'Cerrar', { duration: 3000 }),
      });
    });
  }

  onFormalityUpdate(item: FormalityModel): void {
    const ref = this.dialog.open(FormalityUpdateDialog, {
      data: { item },
      width: '640px',
      maxHeight: '90vh',
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      const table = this.tableComponent();
      if (!table) return;

      this.service.update(result, item.idFormality).subscribe({
        next: () => {
          this.snackBar.open('Trámite actualizado', 'Cerrar', { duration: 3000 });
          table.loadRequests();
        },
        error: () => this.snackBar.open('Error actualizando trámite', 'Cerrar', { duration: 3000 }),
      });
    });
  }

  onFormalityDelete(item: FormalityModel): void {
    const table = this.tableComponent();
    if (!table) return;

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: {
        title: 'Eliminar Trámite',
        message: `¿Está seguro de que desea eliminar ${item.title}?`,
        confirmLabel: 'Eliminar',
        cancelLabel: 'Cancelar',
        icon: 'delete_forever',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.service.destroy(item.idFormality).subscribe({
        next: () => {
          this.snackBar.open('Trámite eliminado', 'Cerrar', { duration: 3000 });
          table.loadRequests();
        },
        error: () => this.snackBar.open('Error eliminando trámite', 'Cerrar', { duration: 3000 }),
      });
    });
  }

  onFormalityDeleteMultiple(items: FormalityModel[]): void {
    const table = this.tableComponent();
    if (!table) return;

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: {
        title: 'Eliminar Trámites',
        message: `¿Eliminar ${items.length} trámites? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        cancelLabel: 'Cancelar',
        icon: 'delete_forever',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      const requests = items.map((i) => this.service.destroy(i.idFormality));
      forkJoin(requests).subscribe({
        next: () => {
          table.loadRequests();
          this.snackBar.open(`${items.length} trámites eliminados`, 'Cerrar', { duration: 3000 });
        },
        error: () => this.snackBar.open('Error eliminando trámites', 'Cerrar', { duration: 3000 }),
      });
    });
  }
}
