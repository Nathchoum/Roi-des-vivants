import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Carte } from '../models/carte.model';
import { Joueur } from '../models/joueur.model';
import { Partie } from '../models/partie.model';
@Injectable({
  providedIn: 'root'
})
export class PartieService {

  private apiUrl = 'http://localhost:8080/api/partie';

  constructor(private http: HttpClient) {}

  initPartie(joueurs: Joueur[]): Observable<Partie> {
    const pseudos = joueurs.map(joueur => joueur.pseudo);
    return this.http.post<Partie>(`${this.apiUrl}/initPartie`, pseudos);
  }

  devinerFaction(actionnaire: Joueur,cible: Joueur,guess: string): Observable<string> {
    const params = new HttpParams().set('guess', guess);
    const duo: Joueur[] = [actionnaire, cible];
    return this.http.post(`${this.apiUrl}/devinerFaction`, duo, {
      params,
      responseType: 'text'
    });
  }

  comparer(actionnaire:Joueur,cible:Joueur) : Observable<string>{
    const duo : Joueur[] = [actionnaire,cible]; 
    return this.http.post(`${this.apiUrl}/comparer`, duo, {
      responseType:'text'
    });
  }

  tuer(actionnaire:Joueur,cible:Joueur,guessValeur:number,guessFaction:string,veutEchanger:boolean) : Observable<string>{
    let params = new HttpParams();
    params = params.set('guessValeur', guessValeur.toString());
    params = params.set('guessFaction', guessFaction);
    params = params.set('veutEchanger', veutEchanger.toString());
    const duo : Joueur[] = [actionnaire,cible]; 
    return this.http.post(`${this.apiUrl}/tuer`, duo,{
      params,
      responseType:'text'
    });
  }
  regarderSaCarte(actionnaire:Joueur) : Observable<Carte>{
    return this.http.post<Carte>(`${this.apiUrl}/regarderSaCarte`, actionnaire);
  }
  /*on met <T> si le type est pas de base donc nos types*/
}