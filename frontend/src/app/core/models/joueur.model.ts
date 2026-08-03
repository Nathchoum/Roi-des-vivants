import { Carte } from './carte.model';
export enum Etat {
  VIVANT = 'VIVANT',
  MORT = 'MORT',
  ELIMINE = 'ELIMINE'
}
export interface Joueur {
  pseudo: string;
  etat: Etat;
  carte?: Carte;
}