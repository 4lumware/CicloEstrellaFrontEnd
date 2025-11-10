import { Component, signal, WritableSignal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

interface SolicitudProfesor {
  id: number;
  nombreCompleto: string;
  email: string;
  especialidad: string;
  fechaSolicitud: Date;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  solicitadoPor: string;
}

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatTooltipModule,
  ],
  templateUrl: './solicitudes.html',
  styleUrl: './solicitudes.css',
})
export class Solicitudes {
  displayedColumns: string[] = [
    'id',
    'nombreCompleto',
    'email',
    'especialidad',
    'fechaSolicitud',
    'solicitadoPor',
    'estado',
    'acciones',
  ];

  solicitudes: WritableSignal<SolicitudProfesor[]> = signal<SolicitudProfesor[]>([
    {
      id: 1,
      nombreCompleto: 'Dr. Juan Pérez García',
      email: 'juan.perez@example.com',
      especialidad: 'Matemáticas Avanzadas',
      fechaSolicitud: new Date('2025-01-15'),
      estado: 'pendiente',
      solicitadoPor: 'María González',
    },
    {
      id: 2,
      nombreCompleto: 'Dra. Ana Martínez López',
      email: 'ana.martinez@example.com',
      especialidad: 'Física Cuántica',
      fechaSolicitud: new Date('2025-01-18'),
      estado: 'pendiente',
      solicitadoPor: 'Carlos Ramírez',
    },
    {
      id: 3,
      nombreCompleto: 'Dr. Luis Rodríguez Sánchez',
      email: 'luis.rodriguez@example.com',
      especialidad: 'Programación Web',
      fechaSolicitud: new Date('2025-01-20'),
      estado: 'aprobada',
      solicitadoPor: 'Laura Torres',
    },
    {
      id: 4,
      nombreCompleto: 'Dra. Carmen Díaz Fernández',
      email: 'carmen.diaz@example.com',
      especialidad: 'Base de Datos',
      fechaSolicitud: new Date('2025-01-22'),
      estado: 'rechazada',
      solicitadoPor: 'Pedro Sánchez',
    },
    {
      id: 5,
      nombreCompleto: 'Dr. Roberto Hernández',
      email: 'roberto.hernandez@example.com',
      especialidad: 'Inteligencia Artificial',
      fechaSolicitud: new Date('2025-01-25'),
      estado: 'pendiente',
      solicitadoPor: 'Sofía Jiménez',
    },
  ]);

  getEstadoColor(estado: string): string {
    const colores: { [key: string]: string } = {
      pendiente: 'warn',
      aprobada: 'primary',
      rechazada: 'accent',
    };
    return colores[estado] || 'primary';
  }

  aprobarSolicitud(solicitud: SolicitudProfesor): void {
    console.log('Aprobando solicitud:', solicitud);
    // Aquí iría la lógica para aprobar la solicitud
  }

  rechazarSolicitud(solicitud: SolicitudProfesor): void {
    console.log('Rechazando solicitud:', solicitud);
    // Aquí iría la lógica para rechazar la solicitud
  }

  verDetalles(solicitud: SolicitudProfesor): void {
    console.log('Ver detalles de solicitud:', solicitud);
    // Aquí iría la lógica para ver detalles
  }
}
