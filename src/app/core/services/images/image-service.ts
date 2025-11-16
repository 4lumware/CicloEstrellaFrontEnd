import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../constants/api';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private apiUrl = API_URL;
  private http = inject(HttpClient);

  /**
   * Obtiene una imagen de perfil desde el servidor
   * @param filename - Nombre del archivo (ej: "pepe123_1762268713349.png")
   * @returns Observable con el Blob de la imagen
   */
  getProfileImage(filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/api/images/profiles/${filename}`, {
      responseType: 'blob',
    });
  }

  /**
   * Construye la URL completa para una imagen de perfil
   * @param filename - Nombre del archivo o ruta completa
   * @returns URL completa de la imagen
   */
  getProfileImageUrl(filename: string | undefined): string {
    if (!filename) return '';

    // Si es base64 o ya tiene protocolo, devolverla tal cual
    if (
      filename.startsWith('data:') ||
      filename.startsWith('http://') ||
      filename.startsWith('https://')
    ) {
      return filename;
    }

    // Si empieza con '/', extraer solo el nombre del archivo
    if (filename.startsWith('/images/profiles/')) {
      const parts = filename.split('/');
      const name = parts[parts.length - 1];
      return `${this.apiUrl}/images/profiles/${name}`;
    }

    // Si es solo el nombre del archivo
    return `${this.apiUrl}/images/profiles/${filename}`;
  }

  /**
   * Construye la URL completa para cualquier ruta de imagen
   * Útil para diferentes tipos de imágenes (perfiles, posts, etc.)
   * @param relativePath - Ruta relativa (ej: "/images/profiles/user.png")
   * @returns URL completa
   */
  buildImageUrl(relativePath: string | undefined): string | null {
    if (!relativePath) return null;

    // Si es base64 o ya tiene protocolo, devolverla tal cual
    if (
      relativePath.startsWith('data:') ||
      relativePath.startsWith('http://') ||
      relativePath.startsWith('https://')
    ) {
      return relativePath;
    }

    // Si empieza con '/', es una ruta relativa del servidor
    if (relativePath.startsWith('/')) {
      return `${this.apiUrl}${relativePath}`;
    }

    return relativePath;
  }
}
