import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component,OnInit,OnChanges } from '@angular/core';
import { Partie } from '../../core/models/partie.model';

import { Etat, Joueur } from '../../core/models/joueur.model';
import { Carte } from '../../core/models/carte.model';
import { PartieService } from '../../core/services/partie.service';
import { JoueurService } from '../../core/services/joueur.service';
import { GameSyncService } from '../../core/services/game-sync.service';

@Component({
  selector: 'app-plateau',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plateau.html',
  styleUrl: './plateau.css',
})

export class PlateauComponent implements OnInit {

  partie?: Partie;
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
    private joueurService: JoueurService,
    private syncService: GameSyncService
  ) {}


  ngOnInit(): void {
    // Ensure a per-browser unique player
    const local = this.joueurService.getOrCreateLocalPlayer();
    this.monJoueur = local;

    // subscribe to sync updates (cross-tab and cross-browser)
    this.syncService.gameState$.subscribe((p) => {
      if (p) {
        this.appliquerPartieMiseAJour(p as Partie);
      }
    });

    this.syncService.stateRequested$.subscribe(() => {
      if (this.partie) this.syncService.broadcastState(this.partie);
    });

    this.syncService.requestCurrentState();
  }
  ngOnChanges():void {
    this.syncService.gameState$.subscribe((p) => {
      if (p) {
        this.appliquerPartieMiseAJour(p as Partie);
      }
    });
  }
  initPartie(): Partie | undefined {
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
        this.syncService.broadcastState(this.partie);
      },
      error: (err) => console.error('Erreur initPartie', err)
    });
    return this.partie;
  }

  appliquerPartieMiseAJour(partie: Partie): void {
    this.partie = partie;
    const currentPlayer = this.joueurService.getLocalPlayer();
    const existing = partie.joueurs?.find((joueur) => joueur.pseudo === currentPlayer?.pseudo);

    if (existing) {
      this.monJoueur = existing;
    } else if (currentPlayer) {
      partie.joueurs = [...(partie.joueurs ?? []), { ...currentPlayer, etat: Etat.VIVANT }];
      this.monJoueur = { ...currentPlayer, etat: Etat.VIVANT };
    }

    const maxIndex = Math.max((partie.joueurs?.length ?? 1) - 1, 0);
    const idx = typeof partie.joueurActifIndex === 'number' ? partie.joueurActifIndex : this.indexJoueurActif;
    this.indexJoueurActif = Math.min(Math.max(idx, 0), maxIndex);
    this.joueurCourant = partie.joueurs[this.indexJoueurActif] ?? partie.joueurs[0];
    this.messageRetour = this.messageRetour || `Synchro réussie ! Tour de ${this.joueurCourant?.pseudo}`;
    console.log(this.partie)
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
        if (this.partie) this.syncService.broadcastState(this.partie);
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
        if (this.partie) this.syncService.broadcastState(this.partie);
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
        if (this.partie) this.syncService.broadcastState(this.partie);
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
        if (this.partie) this.syncService.broadcastState(this.partie);
      }
    });
  }
}