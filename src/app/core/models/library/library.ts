export interface LibraryResponse {
  id: number;
  type: 'TEACHER' | 'FORMALITY';
  note: string;
  favorite: TeacherDetails | FormalityDetails;
}

export interface TeacherDetails {
  id: number;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
  campuses?: Campus[];
}

export interface Campus {
  id: number;
  name: string;
}

export interface FormalityDetails {
  idFormality: number; // ⭐ Nombre diferente
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

export interface FavoriteCreateRequest {
  type: 'TEACHER' | 'FORMALITY';
  referenceId: number;
}
