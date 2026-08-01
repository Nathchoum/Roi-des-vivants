import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component,OnInit,Injectable } from '@angular/core';
import { Partie } from '../../core/models/partie.model';

import { Joueur } from '../../core/models/joueur.model';
import { Carte } from '../../core/models/carte.model';
import { PartieService } from '../../core/services/partie.service';

@Component({
  selector: 'app-plateau',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plateau.html',
  styleUrl: './plateau.css',
})
@Injectable({
  providedIn: 'root'
})
export class PlateauComponent implements OnInit {

  partie?: Partie;
  joueurCourant?: Joueur;
  joueurCible?: Joueur;
  indexJoueurActif: number = 0;
  messageRetour: string = '';



  guessFactionSimple: string = 'coeur';
  guessValeurTuer: number = 1;
  guessFactionTuer: string = 'coeur';
  veutEchanger: boolean = true;

  constructor(private partieService: PartieService) {}

  ngOnInit(): void {}

  initPartie(): void {
    const joueursInitiaux: Joueur[] = [
      { pseudo: 'Alice', etat: 'vivant', carte: {} as Carte },
      { pseudo: 'Bob', etat: 'vivant', carte: {} as Carte },
      { pseudo: 'Charlie', etat: 'vivant', carte: {} as Carte }
    ];

    this.partieService.initPartie(joueursInitiaux).subscribe({
      next: (partieCreee) => {
        this.partie = partieCreee;
        this.indexJoueurActif = 0;
        this.joueurCourant = this.partie.joueurs[this.indexJoueurActif];
        this.messageRetour = 'Partie initialisée et cartes distribuées !';
      },
      error: (err) => console.error('Erreur initPartie', err)
    });
  }

  changerJoueur(): void {
    if (!this.partie || !this.partie.joueurs.length) return;
    this.indexJoueurActif = (this.indexJoueurActif + 1) % this.partie.joueurs.length;
    this.joueurCourant = this.partie.joueurs[this.indexJoueurActif];
    this.joueurCible = undefined;
    this.messageRetour = `Tour de ${this.joueurCourant.pseudo}`;
  }

  changerCycle(): void {
    if (this.partie) {
      this.partie.cycle = this.partie.cycle === 'JOUR' ? 'NUIT' : 'JOUR';
      this.messageRetour = `Nouveau cycle : ${this.partie.cycle}`;
    }
  }


  actionRegarderCarte(): void {
    if (!this.joueurCourant) return;
    this.partieService.regarderSaCarte(this.joueurCourant).subscribe({
      next: (carte) => {
        if (carte.valeur === 11) {
          this.joueurCourant!.etat = 'mort';
          this.messageRetour = 'JOKER (11) ! Tu es mort en regardant ta carte !';
        } else {
          this.messageRetour = `Ta carte : Valeur ${carte.valeur}, Faction ${carte.faction}`;
        }
      }
    });
  }

  actionDevinerFaction(): void {
    if (!this.joueurCourant || !this.joueurCible) {
      this.messageRetour = 'Veuillez sélectionner un joueur cible !';
      return;
    }
    this.partieService.devinerFaction(this.joueurCourant, this.joueurCible, this.guessFactionSimple).subscribe({
      next: (res) => {
        this.messageRetour = `Résultat Deviner Faction : ${res}`;
      }
    });
  }


  actionComparer(): void {
    if (!this.joueurCourant || !this.joueurCible) {
      this.messageRetour = 'Veuillez sélectionner un joueur cible !';
      return;
    }
    this.partieService.comparer(this.joueurCourant, this.joueurCible).subscribe({
      next: (res) => {
        this.messageRetour = `Résultat Comparaison : ${res}`;
      }
    });
  }

  actionTuer(): void {
    if (!this.joueurCourant || !this.joueurCible) {
      this.messageRetour = 'Veuillez sélectionner un joueur cible !';
      return;
    }

    this.partieService.tuer(
      this.joueurCourant,
      this.joueurCible,
      this.guessValeurTuer,
      this.guessFactionTuer,
      this.veutEchanger
    ).subscribe({
      next: (res) => {
        this.messageRetour = res;
      }
    });
  }
}