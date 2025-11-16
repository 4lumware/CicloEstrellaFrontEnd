import {
  Component,
  OnInit,
  output,
  inject,
  WritableSignal,
  signal,
  effect,
  computed,
  viewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../../../../shared/components/ui/confirm-dialog/confirm-dialog';
import { UserManagementSearchForm } from '../user-management-search-form/user-management-search-form';
import { ApplicationUserService } from '../../../../../../core/services/users/rest/application-user-service';
import { ImageService } from '../../../../../../core/services/images/image-service';
import { UserModel as User } from '../../../../../../core/models/users/user';

export interface SearchFilters {
  username: string;
  roleName: string;
  state: boolean | null;
  startDate: Date | null;
  endDate: Date | null;
}

@Component({
  selector: 'app-user-management-table',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatDialogModule,
    UserManagementSearchForm,
  ],
  templateUrl: './user-management-table.html',
  styleUrl: './user-management-table.css',
})
export class UserManagementTable implements OnInit, AfterViewInit {
  private userService = inject(ApplicationUserService);
  private imageService = inject(ImageService);
  protected displayedColumns: string[] = [
    'id',
    'username',
    'email',
    'role',
    'state',
    'creationDate',
    'actions',
  ];
  protected dataSource: WritableSignal<User[]> = signal<User[]>([]);
  protected filteredData: WritableSignal<User[]> = signal<User[]>([]);
  protected paginatedData: WritableSignal<User[]> = signal<User[]>([]);
  public userUpdate = output<User>();
  public userDelete = output<User>();
  protected selectedUsers: WritableSignal<User[]> = signal<User[]>([]);
  protected countUser = computed(() => this.selectedUsers().length);
  protected snackBar: MatSnackBar = inject(MatSnackBar);
  protected dialog: MatDialog = inject(MatDialog);

  protected pageSize = 10;
  protected pageIndex = 0;
  protected totalItems = signal<number>(0);
  protected totalPages = signal<number>(0);
  protected pageSizeOptions = [5, 10, 25, 50];
  searchFormComponent = viewChild(UserManagementSearchForm);

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    const formGroup = this.searchFormComponent()?.formGroup;
    if (formGroup) {
      formGroup.valueChanges.subscribe(() => {
        console.log('Filtros cambiados:', formGroup.value);
        this.pageIndex = 0;
        this.applyFilters();
      });
    }
  }

  loadUsers(): void {
    this.userService.index(this.pageIndex, this.pageSize).subscribe({
      next: (response: any) => {
        console.log('Response completa:', response);
        const pageData = response.data;

        // Actualizar datos desde el servidor
        this.dataSource.set(pageData.content ?? []);
        this.paginatedData.set(pageData.content ?? []);
        this.totalItems.set(pageData.totalElements ?? 0);
        this.totalPages.set(pageData.totalPages ?? 0);

        console.log('Total elementos:', this.totalItems());
        console.log('Total páginas:', this.totalPages());
      },
      error: () => {
        this.snackBar.open('Error al cargar usuarios', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      },
    });
  }

  applyFilters(): void {
    const filters = this.searchFormComponent()?.formGroup.value as Partial<
      SearchFilters & { state: boolean | 'all' }
    >;

    // Filtrado del lado del cliente sobre los datos actuales
    this.filteredData.set(
      this.dataSource().filter((user) => {
        if (
          filters.username &&
          !user.username.toLowerCase().includes(filters.username.toLowerCase())
        ) {
          return false;
        }

        if (filters.roleName !== 'all' && filters.roleName) {
          if (user.roles.every((r) => r.roleName !== filters.roleName)) {
            return false;
          }
        }

        if (filters.state === true || filters.state === false) {
          if (user.state !== filters.state) return false;
        }

        const filterStart = filters.startDate ? new Date(filters.startDate) : null;
        const filterEnd = filters.endDate ? new Date(filters.endDate) : null;
        const userDate = new Date(user.creationDate);
        if (filterStart && userDate < filterStart) return false;
        if (filterEnd && userDate > filterEnd) return false;
        return true;
      })
    );

    this.paginatedData.set(this.filteredData());
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    // Cargar nueva página desde el servidor
    this.loadUsers();
  }

  onRowClick(user: User): void {
    const selected = this.selectedUsers();
    const index = selected.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      selected.splice(index, 1);
    } else {
      selected.push(user);
    }
    this.selectedUsers.set([...selected]);
  }

  isSelected(user: User): boolean {
    return this.selectedUsers().some((u) => u.id === user.id);
  }

  /**
   * Obtiene la URL completa de la imagen de perfil usando el ImageService
   * @param url - URL relativa o completa de la imagen
   * @returns URL completa o URL por defecto
   */
  getProfileImageUrl(url: string | undefined): string {
    if (!url) return 'assets/default-avatar.png'; // URL de imagen por defecto

    const imageUrl = this.imageService.buildImageUrl(url);
    return imageUrl || 'assets/default-avatar.png';
  }

  onUpdate(user: User): void {
    // Emitir el evento al componente padre para que maneje la actualización
    this.userUpdate.emit(user);
  }

  onDelete(user: User): void {
    // Emitir el evento al componente padre para que maneje la eliminación
    this.userDelete.emit(user);
  }

  deleteSelected(): void {
    const selected = this.selectedUsers();
    if (selected.length === 0) return;

    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Eliminar seleccionados',
        message: `¿Estás seguro de que deseas eliminar ${selected.length} usuario(s) seleccionado(s)?`,
        confirmLabel: 'Eliminar todos',
        cancelLabel: 'Cancelar',
        icon: 'delete_sweep',
        color: 'warn',
      },
    });

    ref.afterClosed().subscribe((ok) => {
      if (!ok) return;
      const selectedIds = selected.map((u) => u.id);
      this.dataSource.set(this.dataSource().filter((u) => !selectedIds.includes(u.id)));
      selected.forEach((user) => this.userDelete.emit(user));
      this.selectedUsers.set([]);
      this.applyFilters();
      this.snackBar.open(`${selected.length} usuario(s) han sido eliminados`, 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    });
  }
}
