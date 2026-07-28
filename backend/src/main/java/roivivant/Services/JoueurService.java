package roivivant.Services;

import org.springframework.stereotype.Service;
import roivivant.Models.Carte;
import roivivant.Models.Joueur;

@Service
public class JoueurService {
    // /!\ IL FAUDRA IMPLEMENTER LES EFFETS DU JOUR ET DE LA NUIT LORSQUE NOUS POURRONS INITIALISER UNE PARTIE /!\

    /**
     * action permettant d'essayer de deviner la faction de la carte du joueur ciblé, si le joueur guess la faction dont sa carte fait parti, il meurt
     * * @param joueur1, le joueur faisant l'action
     * @param joueur2, le joueur ciblé
     * @param guess, le guess du joueur1
     * @return la réponse
     */
    public String devinerFaction(Joueur joueur1, Joueur joueur2, String guess) {
        if (joueur1.getCarte().getFaction().equals(guess)) {
            joueur1.setEtat("mort");
            return "il a tout whippin";
        }
        if (joueur2.getCarte().getFaction().equals(guess)) {
            return "bravo c'est ça";
        }
        return "big looser";
    }

    /**
     * action permettant de comparer les cartes des 2 joueurs
     * * @param joueur1, le joueur qui lance l'action
     * @param joueur2, le joueur choisit par joueur1
     * @return pour l'instant un string, à voir si on peut pas faire mieux par la suite
     */
    public String comparer(Joueur joueur1, Joueur joueur2) {
        if (joueur1.getCarte().getValeur() > joueur2.getCarte().getValeur()) {
            return "Youpiii !";
        }
        if (joueur1.getCarte().getValeur() < joueur2.getCarte().getValeur() || joueur2.getCarte().getValeur() == 11) {
            return "Ouuuh.";
        }
        return "bof";
    }

    /**
     * action permettant de tuer un autre joueur si le joueur lançant l'action a le bon guess, celui-ci peut échanger son rôle, garder le sien ou ressuciter.
     * @param joueur1, joueur lançant l'action
     * @param joueur2, joueur ciblé
     * @param guessValeur, guess de la valeur du joueur ciblé
     * @param guessFaction, guess de la faction du joueur ciblé
     * @param veutEchanger, si joueur1 souhaite échanger son rôle
     * @return
     */
    public String tuer(Joueur joueur1, Joueur joueur2, int guessValeur, String guessFaction, boolean veutEchanger) {
        if ("mort".equals(joueur2.getEtat())) {
            return "Action impossible : la cible est déjà morte.";
        }

        boolean aBon = (joueur2.getCarte().getValeur() == guessValeur)
                && guessFaction.equalsIgnoreCase(joueur2.getCarte().getFaction());

        if (!aBon) {
            return "Raté ! Le devinement est incorrect.";
        }

        joueur2.setEtat("mort");

        if ("vivant".equals(joueur1.getEtat())) {
            if (veutEchanger) {
                echangerCartesEtRoles(joueur1, joueur2);
                return "8 morts 6 bléssés ! Joueur 1 a choisi d'échanger son rôle avec la cible.";
            }
            return "8 morts 6 bléssés  ! Joueur 1 conserve son rôle.";
        } else if ("mort".equals(joueur1.getEtat())) {
            echangerCartesEtRoles(joueur1, joueur2);
            joueur1.setEtat("vivant");
            return "8 morts 6 bléssés  ! Joueur 1 ressuscite et prend le rôle de sa cible.";
        }

        return "Erreur d'état du joueur.";
    }

    // Méthode utilitaire pour simplifier l'échange de cartes
    private void echangerCartesEtRoles(Joueur j1, Joueur j2) {
        Carte temp = j1.getCarte();
        j1.setCarte(j2.getCarte());
        j2.setCarte(temp);
    }

    /**
     * action permettant de regarder sa propre carte
     * * @param joueur qui lance l'action
     * @return la carte du joueur, s'il a le joker, il meurt
     */
    public Carte regarderSaCarte(Joueur joueur) {
        if (joueur.getCarte().getValeur() == 11) {
            joueur.setEtat("mort");
        }
        return joueur.getCarte();
    }
}