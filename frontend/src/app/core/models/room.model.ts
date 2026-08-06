import { Joueur } from './joueur.model';
export interface Room {
  idPartie: string;
  joueurs: Joueur[];
}