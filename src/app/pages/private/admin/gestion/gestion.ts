import { Component, signal, WritableSignal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';

interface Comentario {
  id: number;
  autor: string;
  contenido: string;
  fechaCreacion: Date;
  seccion: string;
  reportes: number;
  estado: 'activo' | 'oculto' | 'eliminado';
}

@Component({
  selector: 'app-gestion',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatTooltipModule,
    MatBadgeModule,
  ],
  templateUrl: './gestion.html',
  styleUrl: './gestion.css',
})
export class Gestion {
  displayedColumns: string[] = [
    'id',
    'autor',
    'contenido',
    'seccion',
    'fechaCreacion',
    'reportes',
    'estado',
    'acciones',
  ];

  comentarios: WritableSignal<Comentario[]> = signal<Comentario[]>([
    {
      id: 1,
      autor: 'Carlos Ramírez',
      contenido: 'Excelente profesor, muy claro en sus explicaciones.',
      fechaCreacion: new Date('2025-01-10'),
      seccion: 'Perfil de Profesor',
      reportes: 0,
      estado: 'activo',
    },
    {
      id: 2,
      autor: 'Ana López',
      contenido: 'Este comentario contiene contenido inapropiado que debe ser revisado.',
      fechaCreacion: new Date('2025-01-12'),
      seccion: 'Perfil de Profesor',
      reportes: 5,
      estado: 'activo',
    },
    {
      id: 3,
      autor: 'Pedro González',
      contenido: 'Me ayudó mucho con mi proyecto de tesis.',
      fechaCreacion: new Date('2025-01-15'),
      seccion: 'Perfil de Profesor',
      reportes: 0,
      estado: 'activo',
    },
    {
      id: 4,
      autor: 'María Torres',
      contenido: 'Spam spam spam...',
      fechaCreacion: new Date('2025-01-18'),
      seccion: 'Foro General',
      reportes: 12,
      estado: 'oculto',
    },
    {
      id: 5,
      autor: 'Luis Fernández',
      contenido: '¿Alguien sabe cuándo son los exámenes finales?',
      fechaCreacion: new Date('2025-01-20'),
      seccion: 'Foro General',
      reportes: 0,
      estado: 'activo',
    },
    {
      id: 6,
      autor: 'Sofía Martínez',
      contenido: 'Comentario eliminado por violar normas de la comunidad.',
      fechaCreacion: new Date('2025-01-22'),
      seccion: 'Perfil de Profesor',
      reportes: 20,
      estado: 'eliminado',
    },
  ]);

  estadisticas = signal({
    total: 150,
    activos: 125,
    ocultos: 15,
    eliminados: 10,
    reportados: 8,
  });

  getEstadoColor(estado: string): string {
    const colores: { [key: string]: string } = {
      activo: 'primary',
      oculto: 'warn',
      eliminado: 'accent',
    };
    return colores[estado] || 'primary';
  }

  ocultarComentario(comentario: Comentario): void {
    console.log('Ocultando comentario:', comentario);
    // Aquí iría la lógica para ocultar el comentario
  }

  eliminarComentario(comentario: Comentario): void {
    console.log('Eliminando comentario:', comentario);
    // Aquí iría la lógica para eliminar el comentario
  }

  restaurarComentario(comentario: Comentario): void {
    console.log('Restaurando comentario:', comentario);
    // Aquí iría la lógica para restaurar el comentario
  }

  verDetalles(comentario: Comentario): void {
    console.log('Ver detalles de comentario:', comentario);
    // Aquí iría la lógica para ver detalles
  }
}
