package roivivant.Services;

import com.sun.jdi.request.StepRequest;
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

    public Partie initPartie (List<Joueur> joueurs){
        ArrayList<String> enseignes = new ArrayList<>();
        enseignes.add("coeur");
        enseignes.add("piques");
        enseignes.add("trefle");
        enseignes.add("carreau");
        List<Carte> pile = carteService.generePool(40, enseignes);

        Collections.shuffle(pile);

        int nbjoueurs = joueurs.size();
        int postjoker = (int) (Math.random() * nbjoueurs);
        Carte joker = new Carte(11,null);
        pile.set(postjoker,joker);
        for (int i = 0; i < nbjoueurs; i++) {
            Joueur joueur = joueurs.get(i);
            joueur.setEtat("vivant");
            joueur.setCarte(pile.removeFirst());
        }

        return new Partie(joueurs,pile);
    }


    public void jouerUnTour(){

    }

    public String jouerDevinerFaction(Joueur actionnaire, Joueur cible, String guess){
        return  joueurService.devinerFaction(actionnaire,cible,guess);
    }

    public String jouerComparer(Joueur actionnaire, Joueur cible){
        return joueurService.comparer(actionnaire,cible);
    }

    public String jouerTuer(Joueur actionnaire, Joueur cible, int guessValeur, String guessFaction, boolean veutEchanger){
        return joueurService.tuer(actionnaire, cible, guessValeur, guessFaction, veutEchanger);
    }

    public Carte jouerRegarderSaCarte(Joueur actionnaire){
        return joueurService.regarderSaCarte(actionnaire);
    }

}
