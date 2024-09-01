import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api_Payload } from '../models/api_payload.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private http = inject(HttpClient);

  fetchAllMovies(payload: Partial<Api_Payload>): Observable<any> {
    let { page_number, page_size, genre } = payload;
    let params = new HttpParams()
      .set('page_number', page_number ?? 1)
      .set('page_size', page_size ?? 20)
      .set("genre", genre ?? '');

    return this.http.get('http://localhost:3000/api/movie', { params });

  }

  fetchGenres(): Observable<any> {
    return this.http.get('http://localhost:3000/api/genres');
  }
}
