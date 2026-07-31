import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Carte } from '../models/carte.model';

@Injectable({
  providedIn: 'root'
})
export class CarteService {

  private apiUrl = 'http://localhost:8080/api/cartes';

  constructor(private http: HttpClient) {}

  getPool(): Observable<Carte[]> {
    return this.http.get<Carte[]>(`${this.apiUrl}/pool`);
  }
}