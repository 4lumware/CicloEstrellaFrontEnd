// Define los tipos de ítems que guardas
export type LibraryItemType = 'TEACHER' | 'FORMALITY';

// LO QUE ENVÍAS AL BACKEND (Para guardar)
export interface LibraryRequest {
  referenceId: number;   // El ID del Profe o Trámite
  favoriteType: LibraryItemType;
  note: string;
}

// LO QUE RECIBES DEL BACKEND (Para mostrar en la lista)
export interface LibraryResponse {
  id: number;            // El ID del favorito (necesario para el delete)
  referenceId: number;   // El ID original
  favoriteType: LibraryItemType;
  note: string;
  studentId: number;

  // ⚠️ OJO: Asumimos que tu backend llena este campo con los datos reales.
  // Si tu backend solo devuelve IDs, avísame para ajustar la estrategia.
  details?: any; // Aquí vendría el objeto TeacherModel o FormalityModel
}
