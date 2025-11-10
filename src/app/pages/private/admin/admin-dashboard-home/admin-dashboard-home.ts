import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

interface EstadisticaCard {
  titulo: string;
  valor: number;
  icono: string;
  color: string;
  cambio: number;
}

interface DatoGrafica {
  mes: string;
  usuarios: number;
  solicitudes: number;
  comentarios: number;
}

@Component({
  selector: 'app-admin-dashboard-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './admin-dashboard-home.html',
  styleUrl: './admin-dashboard-home.css',
})
export class AdminDashboardHome {
  estadisticas = signal<EstadisticaCard[]>([
    {
      titulo: 'Usuarios Totales',
      valor: 1248,
      icono: 'group',
      color: '#4b5563',
      cambio: 12.5,
    },
    {
      titulo: 'Profesores Activos',
      valor: 85,
      icono: 'school',
      color: '#1f2937',
      cambio: 8.3,
    },
    {
      titulo: 'Solicitudes Pendientes',
      valor: 23,
      icono: 'assignment',
      color: '#dc2626',
      cambio: -5.2,
    },
    {
      titulo: 'Comentarios Hoy',
      valor: 142,
      icono: 'comment',
      color: '#9ca3af',
      cambio: 18.7,
    },
  ]);

  datosGrafica = signal<DatoGrafica[]>([
    { mes: 'Enero', usuarios: 1050, solicitudes: 45, comentarios: 320 },
    { mes: 'Febrero', usuarios: 1100, solicitudes: 52, comentarios: 380 },
    { mes: 'Marzo', usuarios: 1180, solicitudes: 38, comentarios: 420 },
    { mes: 'Abril', usuarios: 1210, solicitudes: 47, comentarios: 390 },
    { mes: 'Mayo', usuarios: 1248, solicitudes: 23, comentarios: 142 },
  ]);

  actividadReciente = signal([
    {
      tipo: 'usuario',
      mensaje: 'Nuevo usuario registrado: María González',
      tiempo: 'Hace 5 minutos',
      icono: 'person_add',
    },
    {
      tipo: 'solicitud',
      mensaje: 'Nueva solicitud de profesor: Dr. Juan Pérez',
      tiempo: 'Hace 15 minutos',
      icono: 'assignment',
    },
    {
      tipo: 'comentario',
      mensaje: 'Comentario reportado en perfil de profesor',
      tiempo: 'Hace 30 minutos',
      icono: 'flag',
    },
    {
      tipo: 'aprobacion',
      mensaje: 'Solicitud aprobada: Dra. Ana Martínez',
      tiempo: 'Hace 1 hora',
      icono: 'check_circle',
    },
  ]);

  getMaxValor(datos: DatoGrafica[], campo: keyof DatoGrafica): number {
    return Math.max(...datos.map((d) => d[campo] as number));
  }

  calcularAltura(valor: number, max: number): string {
    return `${(valor / max) * 100}%`;
  }
}
