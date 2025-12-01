import {Component, inject, OnInit} from '@angular/core';
import { LibraryService } from '../../../../core/services/library/library-service';
import {FormalityDetails, LibraryResponse, TeacherDetails} from '../../../../core/models/library/library';
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatIconButton} from '@angular/material/button';
import {MatCard, MatCardModule} from '@angular/material/card';
import {CommonModule, DatePipe, NgIf} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthCurrentUserService} from '../../../../core/services/users/auth/auth-current-user-service';

@Component({
  selector: 'app-library',
  templateUrl: './library.html',
  imports: [
    CommonModule,      // 🚨 2. AGREGAR ESTO AQUÍ (Vital para *ngFor)
    FormsModule,       // Vital para [(ngModel)]
    MatCardModule,     // Vital para <mat-card>
    MatIcon,
    FormsModule,
    MatIconButton,
    MatCard,
    NgIf,
    DatePipe
  ],
  styleUrls: ['./library.css']
})
export class Library implements OnInit {
  private libraryService = inject(LibraryService);
  private authService = inject(AuthCurrentUserService);
  private snackBar = inject(MatSnackBar);

  currentUserId: number | null = null;

  // Listas separadas con tipos específicos
  profesoresGuardados: Array<LibraryResponse & { details: TeacherDetails }> = [];
  tramitesGuardados: Array<LibraryResponse & { details: FormalityDetails }> = [];

  // Variables para la Nota General
  isGeneralNoteOpen: boolean = false;
  generalNote: string = '';

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();

    if (this.currentUserId) {
      this.loadLibrary();
    }

    // Cargar nota general del LocalStorage
    this.generalNote = localStorage.getItem('library_general_note') || '';
  }

  loadLibrary(): void {
    if (!this.currentUserId) return;

    console.log('🔍 Cargando biblioteca para usuario:', this.currentUserId);

    this.libraryService.getLibrary(this.currentUserId).subscribe({
      next: (items) => {
        console.log('📦 Datos recibidos del backend:', items);

        // ⭐ CAMBIAR: Usar "type" en lugar de "favoriteType"
        this.profesoresGuardados = items
          .filter((i) => i.type === 'TEACHER')
          .map((i) => {
            console.log('👨‍🏫 Profesor encontrado:', i);
            return {
              ...i,
              details: i.favorite as TeacherDetails,
            };
          });

        this.tramitesGuardados = items
          .filter((i) => i.type === 'FORMALITY')
          .map((i) => {
            console.log('📄 Trámite encontrado:', i);
            return {
              ...i,
              details: i.favorite as FormalityDetails,
            };
          });

        console.log('✅ Profesores guardados:', this.profesoresGuardados);
        console.log('✅ Trámites guardados:', this.tramitesGuardados);
      },
      error: (err) => {
        console.error('❌ Error cargando biblioteca:', err);
        this.snackBar.open('Error al cargar la biblioteca', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  deleteItem(favoriteId: number): void {
    if (!this.currentUserId) return;

    if (confirm('¿Estás seguro de eliminar este elemento?')) {
      this.libraryService.removeFromLibrary(this.currentUserId, favoriteId).subscribe({
        next: () => {
          this.snackBar.open('Elemento eliminado', 'Cerrar', { duration: 2000 });
          this.loadLibrary();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 });
        },
      });
    }
  }

  toggleGeneralNote(): void {
    this.isGeneralNoteOpen = !this.isGeneralNoteOpen;
  }

  saveGeneralNote(): void {
    localStorage.setItem('library_general_note', this.generalNote);
    this.snackBar.open('Nota guardada', 'Cerrar', { duration: 1500 });
  }
}
