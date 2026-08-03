import { Joueur } from './joueur.model';
export interface Partie {
  idPartie: string;
  cycle: string;
  joueurs: Joueur[];
  joueurActifIndex?: number;
}