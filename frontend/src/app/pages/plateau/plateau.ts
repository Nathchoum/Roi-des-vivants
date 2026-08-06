import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component,OnInit,OnChanges } from '@angular/core';
import { Partie } from '../../core/models/partie.model';

import { Etat, Joueur } from '../../core/models/joueur.model';
import { Carte } from '../../core/models/carte.model';
import { PartieService } from '../../core/services/partie.service';
import { JoueurService } from '../../core/services/joueur.service';
import { RoomService } from '../../core/services/room.service';
import { Room } from '../../core/models/room.model';

@Component({
  selector: 'app-plateau',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plateau.html',
  styleUrl: './plateau.css',
})

export class PlateauComponent implements OnInit {

  partie?: Partie;
  room?:Room;
  joueurCourant?: Joueur;
  joueurCible?: Joueur;
  monJoueur?: Joueur;
  indexJoueurActif: number = 0;
  messageRetour: string = '';



  guessFactionSimple: string = 'coeur';
  guessValeurTuer: number = 1;
  guessFactionTuer: string = 'coeur';
  veutEchanger: boolean = true;

  constructor(
    private partieService: PartieService,
    private roomService: RoomService,
    private joueurService: JoueurService,
  ) {}


  ngOnInit(): void {
    // Ensure a per-browser unique player
    const local = this.joueurService.getOrCreateLocalPlayer();
    this.monJoueur = local;
  }
  rejoindreRoom() : void{ //rejoindre une room qui existe
    this.ajouterJoueur(this.joueurService.getOrCreateLocalPlayer());
  }

  initRoom() : void{
    const local = this.joueurService.getOrCreateLocalPlayer();
    const joueursInitiaux: Joueur[] = [
      { ...local, etat: Etat.VIVANT }
    ];

    this.roomService.initRoom().subscribe({
      next: (roomCree) => {
        this.room = roomCree;
        this.indexJoueurActif = 0;
        this.monJoueur = local;
        this.messageRetour = 'RoomInit!';
      },
      error: (err) => console.error('Erreur initPartie', err)
    });
    this.ajouterJoueur(local)
  }
  /*
  fonction qui creer une room sans init de partie
  fonction qui permet de rejoindre une room GOOD
  fonction qui permet d'ajouter un joueur a une room
  fonction qui permet de lancer une partie en étant dans une room
  */




































  initPartie(): Partie | undefined { //creer partie
    const local = this.joueurService.getOrCreateLocalPlayer();

    const joueursInitiaux: Joueur[] = [
      { ...local, etat: Etat.VIVANT }
    ];

    this.partieService.initPartie(joueursInitiaux).subscribe({
      next: (partieCreee) => {
        this.partie = partieCreee;
        this.indexJoueurActif = 0;
        this.joueurCourant = this.partie.joueurs[this.indexJoueurActif];
        this.monJoueur = this.joueurCourant;
        this.messageRetour = 'Partie initialisée et cartes distribuées !';
        },
      error: (err) => console.error('Erreur initPartie', err)
    });
    return this.partie;
  }

  appliquerPartieMiseAJour(partie: Partie): void {
    
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
          this.joueurCourant!.etat = Etat.MORT;
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


  /*
  
  FONCTIONS UTILS
  
  */

  ajouterJoueur(joueur:Joueur):void{
    if(this.room==undefined) return;
    this.room.joueurs = [...(this.room.joueurs ?? []), { ...joueur, etat: Etat.VIVANT }]
  }
}