package roivivant.Services;

import org.springframework.stereotype.Service;
import roivivant.Models.Carte;
import roivivant.Models.Joueur;
import roivivant.Models.Partie;

import java.util.Objects;

@Service
public class JoueurService {
    // /!\ TODO IL FAUDRA IMPLEMENTER LES EFFETS DU JOUR ET DE LA NUIT LORSQUE NOUS POURRONS INITIALISER UNE PARTIE /!\

    /**
     * action permettant d'essayer de deviner la faction de la carte du joueur ciblé
     * si le joueur guess la faction dont la carte de la cible fait partie, l'actionnaire meurt
     * @param actionnaire, le joueur faisant l'action
     * @param cible, le joueur ciblé
     * @param guess, le guess de l'actionnaire
     * @return la réponse
     */
    public String devinerFaction(Partie.Cycle cycle, Joueur actionnaire, Joueur cible, String guess) {
        if(cycle== Partie.Cycle.JOUR && actionnaire.getCarte()==Carte.Joker){
            echangerCartesEtRoles(actionnaire,cible);
            return "faux";
        }
        if (cible.getCarte().getFaction().equals(guess)) {
            actionnaire.setEtat(Joueur.Etat.MORT);
            return "bon";
        }
        return "faux";
    }

    /**
     * action permettant de comparer les cartes de l'actionnaire et de la cible
     * @param actionnaire, le joueur qui lance l'action
     * @param cible, le joueur choisit par l'actionnaire
     * @return pour l'instant un string, à voir si on peut pas faire mieux par la suite
     */
    public String comparer(Partie.Cycle cycle,Joueur actionnaire, Joueur cible) {
        int valeurActionnaire = actionnaire.getCarte().getValeur();
        int valeurCible = cible.getCarte().getValeur();

        if(valeurActionnaire==Carte.Joker.getValeur()){
            if(cycle== Partie.Cycle.JOUR){
                echangerCartesEtRoles(actionnaire,cible);
                return  "pouce sur le haut";
            }
            else{
                return  "pouce sur le haut";
            }
        }
        if (valeurCible==Carte.Joker.getValeur()) {
            return "pouce sur le bas";
        }
        else if (valeurCible > valeurActionnaire) {
            return "pouce sur le haut";
        }
        else if(valeurCible < valeurActionnaire) {
            return "pouce sur le bas";
        }
        return "pouce sur le coté";
    }

    /**
     * action permettant de tuer un autre joueur vivant, si l'actionnaire a le bon guess, celui-ci peut échanger son rôle, garder le sien ou ressuciter selon son état.
     * @param actionnaire, joueur lançant l'action
     * @param cible, joueur ciblé
     * @param guessValeur, guess de la valeur du joueur ciblé
     * @param guessFaction, guess de la faction du joueur ciblé
     * @param veutEchanger, si actionnaire souhaite échanger son rôle avec la cible
     * @return la réponse
     */
    public String tuer(Joueur actionnaire, Joueur cible, int guessValeur, String guessFaction, boolean veutEchanger) {
        if (cible.getEtat().equals(Joueur.Etat.MORT)) {
            return "rien ne se passe...";
        }
        boolean aBon = (cible.getCarte().getValeur() == guessValeur)
                && guessFaction.equalsIgnoreCase(cible.getCarte().getFaction());

        if (!aBon) {
            return "rien ne se passe...";
        }

        cible.setEtat(Joueur.Etat.MORT);

        if (actionnaire.getEtat().equals(Joueur.Etat.VIVANT)) {
            if (veutEchanger) {
                echangerCartesEtRoles(actionnaire, cible);
                return "8 morts 6 bléssés ! Joueur 1 a choisi d'échanger son rôle avec la cible.";
            }
            return "8 morts 6 bléssés  ! Joueur 1 conserve son rôle.";
        } else {
            echangerCartesEtRoles(actionnaire, cible);
            actionnaire.setEtat(Joueur.Etat.VIVANT);
            return "8 morts 6 bléssés  ! Joueur 1 ressuscite et prend le rôle de sa cible.";
        }
    }

    // Méthode utilitaire pour simplifier l'échange de cartes
    private void echangerCartesEtRoles(Joueur j1, Joueur j2) {
        Carte temp = j1.getCarte();
        j1.setCarte(j2.getCarte());
        j2.setCarte(temp);
    }
    /**
     * action permettant de regarder sa propre carte
     * @param actionnaire joueur qui lance l'action
     * @return la carte du joueur, s'il a le joker, il meurt
     */
    public Carte regarderSaCarte(Joueur actionnaire) {
        if (Objects.equals(actionnaire.getCarte().getValeur(), Carte.Joker.getValeur())) {
            actionnaire.setEtat(Joueur.Etat.MORT);
        }
        return actionnaire.getCarte();
    }
}