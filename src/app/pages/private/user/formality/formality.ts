import { Component, OnInit } from '@angular/core';
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
  searchTerm: string = '';

  allTramites: FormalityModel[] = [];
  tramitesExistentesFiltrados: FormalityModel[] = [];
  tramitesDisponiblesFiltrados: FormalityModel[] = [];

  constructor(
    private tramitesService: FormalityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTramites();
  }

  /**
   * Carga todos los trámites del backend usando el método index().
   * Se corrige el error de tipado de PageResponse.
   */
// En formality.ts, dentro de loadTramites

  loadTramites(search: string = ''): void {
    const params: FormalityParamsFilter = {
      search: search,
    } as FormalityParamsFilter;

    this.tramitesService.index(params).pipe(
      catchError(error => {
        console.error('Error HTTP al cargar trámites:', error);

        // 🚨 CORRECCIÓN TS2352: Construimos la respuesta anidada que PageResponse exige.
        // Simulamos un objeto de paginación vacío DENTRO de la propiedad 'data'.
        const emptyResponse: PageResponse<FormalityModel[]> = {
          status: error.status || 500,
          message: 'Error al cargar los datos.',
          data: { // <-- 'data' ahora es un objeto, no un array
            totalElements: 0,
            totalPages: 0,
            size: 0,
            content: [], // <-- El array vacío va dentro de 'content'
            number: 0, sort: {}, first: true, last: true, numberOfElements: 0, pageable: {}, empty: true
            // Asegúrate de que todas las propiedades requeridas por el objeto de paginación (Pageable) dentro de 'data' estén aquí.
          } as any, // Usamos 'as any' porque el objeto de paginación dentro de 'data' es complejo.
        } as PageResponse<FormalityModel[]>;
        return of(emptyResponse);
      })
    )
      .subscribe({
        next: (response: PageResponse<FormalityModel[]>) => {

          // 🚨 SOLUCIÓN FINAL: Accedemos a la propiedad anidada: response.data.content
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
        }
      });
  }
  /**
   * Realiza el filtrado local de los trámites y los divide en dos secciones.
   */
  splitAndFilterTramites(term: string): void {
    const lowerTerm = term.toLowerCase();
    const today = new Date();
    // 💡 Establecemos la hora a medianoche para solo comparar la fecha
    today.setHours(0, 0, 0, 0);

    // Filtro principal por término de búsqueda (ya seguro)
    const filteredBySearch = this.allTramites.filter(t =>
      (t.title?.toLowerCase().includes(lowerTerm) ?? false) ||
      (t.description?.toLowerCase().includes(lowerTerm) ?? false)
    );

    // 1. Trámites Disponibles Actualmente (Filtro por FECHA)
    this.tramitesDisponiblesFiltrados = filteredBySearch.filter(t => {
      // Los campos startDate y endDate vienen como tipo Date en tu modelo.
      // Si vienen como strings del backend, se recomienda convertirlos a Date aquí.

      // 🚨 Es CRÍTICO que startDate y endDate sean objetos Date.
      const start = new Date(t.startDate);
      const end = new Date(t.endDate);

      // La disponibilidad es: (Hoy >= Fecha Inicio) AND (Hoy <= Fecha Fin)
      return start <= today && end >= today;
    });

    // 2. Trámites Existentes (Filtro por Tipo/Propósito)
    // Usamos el resto de los trámites que no están en "Disponibles Actualmente"
    // para esta sección, asumiendo que "Existentes" es un concepto más amplio
    // que incluye trámites fuera de su ventana de disponibilidad actual.

    this.tramitesExistentesFiltrados = filteredBySearch.filter(t => {
      // Aseguramos que solo incluya trámites que NO están actualmente disponibles
      // Y además, si tienes alguna propiedad de tipo (e.g., t.type === 'permanente'), la usas aquí.
      const start = new Date(t.startDate);
      const end = new Date(t.endDate);

      // Está Existente si NO está disponible actualmente (o si la fecha fin ya pasó)
      return !(start <= today && end >= today);
    });
  }

  filterTramites(): void {
    this.splitAndFilterTramites(this.searchTerm);
  }

  addTramite(tramite: FormalityModel): void {
    console.log('Trámite seleccionado para añadir:', tramite);
  }

  viewFormalityProfile(tramite: FormalityModel): void {
    this.router.navigate(['/private/tramites', tramite.idFormality]);
  }
}
