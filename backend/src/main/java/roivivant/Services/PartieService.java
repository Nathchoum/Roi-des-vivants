package roivivant.Services;

import org.springframework.stereotype.Service;
import roivivant.Models.Carte;
import roivivant.Models.Joueur;
import roivivant.Models.Partie;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class PartieService {

    public Partie initPartie (ArrayList<Joueur> Joueurs){
        CarteService carteService = new CarteService();
        ArrayList<String> enseignes = new ArrayList<>();
        enseignes.add("coeur");
        enseignes.add("piques");
        enseignes.add("trefle");
        enseignes.add("carreau");
        List<Carte> pile = carteService.generePool(40, enseignes);

        return new Partie(Joueurs,pile);
    }

    JoueurService joueurService = new JoueurService();

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
