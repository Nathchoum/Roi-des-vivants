import { Injectable } from '@angular/core';
import { Etat, Joueur } from '../models/joueur.model';

const STORAGE_KEY = 'roivivant_player';

@Injectable({ providedIn: 'root' })
export class JoueurService {
	constructor() {}

	getLocalPlayer(): Joueur | null {
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY);
			if (!raw) return null;
			return JSON.parse(raw) as Joueur;
		} catch {
			return null;
		}
	}

	setLocalPlayer(pseudo: string): Joueur {
		const joueur: Joueur = { pseudo, etat: Etat.VIVANT };
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(joueur));
		return joueur;
	}

	getOrCreateLocalPlayer(promptMessage = 'Entrez votre pseudo pour cet onglet :'): Joueur {
		let joueur = this.getLocalPlayer();
		if (!joueur) {
			const entered = window.prompt(promptMessage) || `Joueur_${Math.floor(Math.random() * 1000)}`;
			joueur = this.setLocalPlayer(entered);
		}
		return joueur;
	}
}

