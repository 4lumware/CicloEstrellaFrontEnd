import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../constants/api';
import { Observable } from 'rxjs';
import { TagModel } from '../../models/tags/tags';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private apiUrl = API_URL + '/tags';
  private http = inject(HttpClient);

  index(): Observable<TagModel[]> {
    return this.http.get<TagModel[]>(this.apiUrl);
  }
}
