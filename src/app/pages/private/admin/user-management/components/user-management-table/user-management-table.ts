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
import { SharedPaginator } from '../../../../../../shared/components/ui/shared-paginator/shared-paginator';

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
    SharedPaginator,
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
  protected isRefreshing: WritableSignal<boolean> = signal<boolean>(false);
  private refreshStartedAt: number | null = null;
  public userUpdate = output<User>();
  public userDelete = output<User>();
  public userDeleteMultiple = output<User[]>();
  protected selectedUsers: WritableSignal<User[]> = signal<User[]>([]);
  protected countUser = computed(() => this.selectedUsers().length);
  protected snackBar: MatSnackBar = inject(MatSnackBar);
  protected dialog: MatDialog = inject(MatDialog);

  protected pageSize = 5;
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

  onSearchApply(filters: any): void {
    const comp = this.searchFormComponent();
    if (comp && comp.formGroup) {
      comp.formGroup.patchValue(filters);
      this.pageIndex = 0;
      this.applyFilters();
    }
  }

  onSearchClear(): void {
    const comp = this.searchFormComponent();
    if (comp && comp.onClearFilters) {
      comp.onClearFilters();
    }
    // reload original data
    this.pageIndex = 0;
    this.loadUsers();
  }

  loadUsers(): void {
    this.isRefreshing.set(true);
    this.refreshStartedAt = Date.now();
    this.userService.index(this.pageIndex, this.pageSize).subscribe({
      next: (response: any) => {
        console.log('Response completa:', response);
        const pageData = response.data;

        // Actualizar datos desde el servidor
        this.dataSource.set(pageData.content ?? []);
        this.paginatedData.set(pageData.content ?? []);
        this.totalItems.set(pageData.totalElements ?? 0);
        this.totalPages.set(pageData.totalPages ?? 0);

        this.completeRefreshing();
      },
      error: () => {
        this.snackBar.open('Error al cargar usuarios', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        this.completeRefreshing();
      },
    });
  }

  private completeRefreshing(): void {
    const minMs = 1000;
    const started = this.refreshStartedAt ?? 0;
    const elapsed = Date.now() - started;
    const remaining = minMs - elapsed;
    this.refreshStartedAt = null;
    if (remaining > 0) {
      setTimeout(() => this.isRefreshing.set(false), remaining);
    } else {
      this.isRefreshing.set(false);
    }
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
    this.totalItems.set(this.filteredData().length);
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
    // Emitir un solo evento con los usuarios seleccionados para que el padre
    // maneje la confirmación y eliminación en lote.
    this.userDeleteMultiple.emit(selected);
    // Limpiar selección local mientras el padre procesa la eliminación.
    this.selectedUsers.set([]);
  }

  public setRefreshing(value: boolean): void {
    this.isRefreshing.set(value);
  }
}
