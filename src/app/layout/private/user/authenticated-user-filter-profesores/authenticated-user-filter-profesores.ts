import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-filtro',
  imports: [
    CommonModule
  ],
  templateUrl: './authenticated-user-filter-profesores.html',
  styleUrls: ['./authenticated-user-filter-profesores.css']
})
export class FiltroComponent {
  showFiltro: boolean = true;
  sedes = ['MO', 'SM', 'VI', 'SI'];
  modalidades = ['Virtual', 'Presencial'];
  facultades = [
    'Administración en Hotelería y Turismo', 'Arquitectura', 'Artes Contemporáneas',
    'Ciencias de la Salud', 'Ciencias Humanas', 'Comunicaciones', 'Derecho',
    'Diseño', 'Economía', 'Educación', 'Ingeniería', 'Negocios', 'Psicología'
  ];
  

  constructor() { }

  closeFiltro() {
    this.showFiltro = false;
    console.log('Cerrar Filtro');
  }

  selectSede(sede: string) {
    console.log('Sede seleccionada: ', sede);
  }

  selectModalidad(modalidad: string) {
    console.log('Modalidad seleccionada: ', modalidad);
  }

  applyFilters() {
    console.log('Filtros aplicados');
  }

  resetFilters() {
    console.log('Filtros reseteados');
  }
}
