import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Carte } from '../models/carte.model';
import { Joueur } from '../models/joueur.model';
import { Partie } from '../models/partie.model';
import { Room } from '../models/room.model';
@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private apiUrl = 'http://localhost:8080/api/room';

  constructor(private http: HttpClient) {}

  initRoom(): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}/initRoom`, null);
  }

  ajouterJoueur(room: Room): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}/ajouterJoueur`, room);
  }

  transferPartie(): Observable<Partie> {
    return this.http.post<Partie>(`${this.apiUrl}/transferPartie`, null);
  }
  /*on met <T> si le type est pas de base donc nos types*/
}