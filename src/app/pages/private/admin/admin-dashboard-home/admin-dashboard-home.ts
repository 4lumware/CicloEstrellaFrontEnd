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
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './admin-dashboard-home.html',
  styleUrl: './admin-dashboard-home.css',
})
export class AdminDashboardHome {}
