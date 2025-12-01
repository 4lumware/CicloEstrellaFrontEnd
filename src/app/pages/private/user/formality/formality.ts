import {Component, inject, OnInit} from '@angular/core';
import { FormalityService } from '../../../../core/services/formalities/formality-service';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatIconButton} from '@angular/material/button';
import {DatePipe, NgForOf} from '@angular/common';
import {FormalityModel, FormalityParamsFilter} from '../../../../core/models/formalities/formality';
import {PageResponse} from '../../../../core/models/responses/response';
import {MatInputModule} from '@angular/material/input';
import { catchError, of } from 'rxjs';
import {Router} from '@angular/router';
import {LibraryService} from '../../../../core/services/library/library-service';
import {AuthCurrentUserService} from '../../../../core/services/users/auth/auth-current-user-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {AddFavoriteDialog} from '../../../../shared/components/add-favorite-dialog/add-favorite-dialog';

@Component({
  selector: 'app-formality-modal-component',
  templateUrl: './formality.html', // Tu archivo HTML
  imports: [
    MatFormField,
    MatFormFieldModule, // Necesario para estilos de Angular Material
    MatInputModule,     // Necesario para el input dentro de mat-form-field
    MatIcon,
    FormsModule,
    MatCard,
    MatIconButton,
    MatCardContent,
    DatePipe,
    NgForOf
  ],
  styleUrls: ['./formality.css']
})
export class Formality implements OnInit {
  private tramitesService = inject(FormalityService);
  private libraryService = inject(LibraryService); // ⭐ AGREGAR
  private authService = inject(AuthCurrentUserService); // ⭐ AGREGAR
  private router = inject(Router);
  private snackBar = inject(MatSnackBar); // ⭐ AGREGAR
  private dialog = inject(MatDialog); // ⭐ AGREGAR

  searchTerm: string = '';

  allTramites: FormalityModel[] = [];
  tramitesExistentesFiltrados: FormalityModel[] = [];
  tramitesDisponiblesFiltrados: FormalityModel[] = [];

  // ⭐ AGREGAR
  currentUserId: number | null = null;

  ngOnInit(): void {
    // ⭐ Obtener ID del usuario actual
    this.currentUserId = this.authService.getCurrentUserId();

    this.loadTramites();
  }

  loadTramites(search: string = ''): void {
    const params: FormalityParamsFilter = {
      search: search,
    } as FormalityParamsFilter;

    this.tramitesService
      .index(params)
      .pipe(
        catchError((error) => {
          console.error('Error HTTP al cargar trámites:', error);

          const emptyResponse: PageResponse<FormalityModel[]> = {
            status: error.status || 500,
            message: 'Error al cargar los datos.',
            data: {
              totalElements: 0,
              totalPages: 0,
              size: 0,
              content: [],
              number: 0,
              sort: {},
              first: true,
              last: true,
              numberOfElements: 0,
              pageable: {},
              empty: true,
            } as any,
          } as PageResponse<FormalityModel[]>;
          return of(emptyResponse);
        })
      )
      .subscribe({
        next: (response: PageResponse<FormalityModel[]>) => {
          const dataArray = (response.data as any).content;

          if (Array.isArray(dataArray)) {
            this.allTramites = dataArray;
          } else {
            this.allTramites = [];
            console.error('ERROR: No se encontró el arreglo de datos en response.data.content.');
          }

          this.splitAndFilterTramites(this.searchTerm);
        },
        error: (err) => {
          this.allTramites = [];
          this.splitAndFilterTramites('');
          console.error('Fallo en la suscripción final:', err);
        },
      });
  }

  splitAndFilterTramites(term: string): void {
    const lowerTerm = term.toLowerCase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredBySearch = this.allTramites.filter(
      (t) =>
        (t.title?.toLowerCase().includes(lowerTerm) ?? false) ||
        (t.description?.toLowerCase().includes(lowerTerm) ?? false)
    );

    this.tramitesDisponiblesFiltrados = filteredBySearch.filter((t) => {
      const start = new Date(t.startDate);
      const end = new Date(t.endDate);
      return start <= today && end >= today;
    });

    this.tramitesExistentesFiltrados = filteredBySearch.filter((t) => {
      const start = new Date(t.startDate);
      const end = new Date(t.endDate);
      return !(start <= today && end >= today);
    });
  }

  filterTramites(): void {
    this.splitAndFilterTramites(this.searchTerm);
  }

  // ⭐ ACTUALIZAR: Agregar trámite a biblioteca
  addTramite(event: Event, tramite: FormalityModel): void {
    event.stopPropagation(); // Evitar navegación al perfil

    if (!this.currentUserId) {
      this.snackBar.open('Debes iniciar sesión para agregar favoritos', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    // Abrir dialog para agregar nota
    const dialogRef = this.dialog.open(AddFavoriteDialog, {
      width: '500px',
      data: {
        title: `Agregar "${tramite.title}" a Favoritos`,
        type: 'FORMALITY',
      },
    });

    dialogRef.afterClosed().subscribe((note: string | undefined) => {
      if (note !== undefined && this.currentUserId) {
        this.libraryService
          .addToLibrary(this.currentUserId, {
            type: 'FORMALITY',
            referenceId: tramite.idFormality,
          })
          .subscribe({
            next: () => {
              this.snackBar.open(`"${tramite.title}" agregado a tu biblioteca`, 'OK', {
                duration: 2000,
              });
            },
            error: (err) => {
              console.error('Error adding to library:', err);

              if (err.status === 400 && err.error?.message?.includes('ya existe')) {
                this.snackBar.open('Este trámite ya está en tus favoritos', 'Cerrar', {
                  duration: 3000,
                });
              } else {
                this.snackBar.open('Error al agregar a favoritos', 'Cerrar', {
                  duration: 3000,
                });
              }
            },
          });
      }
    });
  }

  viewFormalityProfile(tramite: FormalityModel): void {
    this.router.navigate(['/private/tramites', tramite.idFormality]);
  }
}
