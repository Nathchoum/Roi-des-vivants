import { Carte } from './carte.model';
export interface Joueur {
  pseudo: string;
  etat: string;
  carte : Carte
}