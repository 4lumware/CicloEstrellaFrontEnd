import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../../../core/services/library/library-service';
import { LibraryResponse } from '../../../../core/models/library/library';
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatIconButton} from '@angular/material/button';
import {MatCard, MatCardModule} from '@angular/material/card';
import {CommonModule, DatePipe, NgIf} from '@angular/common';

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

  currentUserId: number = 1; // 🚨 ID harcodeado (Deberías sacarlo de tu AuthService/Token)

  // Listas separadas para el HTML
  profesoresGuardados: LibraryResponse[] = [];
  tramitesGuardados: LibraryResponse[] = [];

  // Variables para la Nota General (Amarilla)
  isGeneralNoteOpen: boolean = false;
  generalNote: string = '';

  constructor(private libraryService: LibraryService) { }

  ngOnInit(): void {
    this.loadLibrary();
    // Cargar nota general del LocalStorage (ya que el backend 'Favorites' no tiene endpoint para esto)
    this.generalNote = localStorage.getItem('library_general_note') || '';
  }

  // --- Carga de Datos ---
  loadLibrary(): void {
    this.libraryService.getLibrary(this.currentUserId).subscribe({
      next: (items) => {
        // Separamos la lista única que viene del backend en dos arreglos
        this.profesoresGuardados = items.filter(i => i.favoriteType === 'TEACHER');
        this.tramitesGuardados = items.filter(i => i.favoriteType === 'FORMALITY');
      },
      error: (err) => console.error('Error cargando biblioteca:', err)
    });
  }

  // --- Acciones ---

  deleteItem(favoriteId: number): void {
    if(confirm('¿Estás seguro de eliminar este elemento?')) {
      this.libraryService.removeFromLibrary(this.currentUserId, favoriteId).subscribe({
        next: () => {
          this.loadLibrary(); // Recargar la lista
        },
        error: (err) => alert('Error al eliminar')
      });
    }
  }

  // --- Lógica Nota General (Sticky Note) ---
  toggleGeneralNote(): void {
    this.isGeneralNoteOpen = !this.isGeneralNoteOpen;
  }

  saveGeneralNote(): void {
    localStorage.setItem('library_general_note', this.generalNote);
  }
}
