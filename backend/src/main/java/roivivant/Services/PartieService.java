package roivivant.Services;

import org.springframework.stereotype.Service;
import roivivant.Models.Carte;
import roivivant.Models.Joueur;
import roivivant.Models.Partie;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class PartieService {
    private final JoueurService joueurService;
    private final CarteService carteService;

    // Injection automatique des services par Spring Boot
    public PartieService(JoueurService joueurService, CarteService carteService) {
        this.joueurService = joueurService;
        this.carteService = carteService;
    }

    public Partie initPartie (ArrayList<Joueur> joueurs){
        ArrayList<String> enseignes = new ArrayList<>();
        enseignes.add("coeur");
        enseignes.add("piques");
        enseignes.add("trefle");
        enseignes.add("carreau");
        List<Carte> pile = carteService.generePool(40, enseignes);

        Collections.shuffle(pile);

        int nbjoueurs = joueurs.size();
        int elu = (int) (Math.random() * nbjoueurs);
        for (int i = 0; i < nbjoueurs; i++) {
            Joueur joueur = joueurs.get(i);
            joueur.setEtat("vivant");
            if (i == elu) {
                // L'élu reçoit le Joker
                joueur.setCarte(new Carte(11, "joker"));
            } else if (!pile.isEmpty()) {
                // Les autres reçoivent une carte de la pile
                joueur.setCarte(pile.removeFirst());
            }
        }

        return new Partie(joueurs,pile);
    }


    public void jouerUnTour(){

    }

    public void jouerDevinerFaction(Joueur actionnaire, Joueur cible, String guess){
        joueurService.devinerFaction(actionnaire,cible,guess);
    }

    public void jouerComparer(Joueur actionnaire, Joueur cible){
        joueurService.comparer(actionnaire,cible);
    }

    public void jouerTuer(Joueur actionnaire, Joueur cible, int guessValeur, String guessFaction, boolean veutEchanger){
        joueurService.tuer(actionnaire, cible, guessValeur, guessFaction, veutEchanger);
    }

    public void jouerRegarderSaCarte(Joueur actionnaire){
        joueurService.regarderSaCarte(actionnaire);
    }

}
