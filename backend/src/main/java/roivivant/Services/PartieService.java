package roivivant.Services;

import com.sun.jdi.request.StepRequest;
import org.springframework.stereotype.Service;
import roivivant.Models.Carte;
import roivivant.Models.Joueur;
import roivivant.Models.Partie;

import java.io.Console;
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
        enseignes.add("pique");
        enseignes.add("trefle");
        enseignes.add("carreau");
        List<Carte> pile = carteService.generePool(40, enseignes);

        Collections.shuffle(pile);

        int nbjoueurs = joueurs.size();
        int postjoker = (int) (Math.random() * nbjoueurs);

        pile.set(postjoker,Carte.Joker);
        for (int i = 0; i < nbjoueurs; i++) {
            Joueur joueur = joueurs.get(i);
            joueur.setEtat(Joueur.Etat.VIVANT);
            joueur.setCarte(pile.removeFirst());
        }
        return new Partie(joueurs,pile);
    }

    public void changerCycle(Partie partie){
        if(partie.getCycle().equals(Partie.Cycle.JOUR)){
            partie.setCycle(Partie.Cycle.NUIT);
        }
        else partie.setCycle(Partie.Cycle.JOUR);
    }
    public void jouerUnTour(Partie partie){
        Joueur courant = partie.getJoueurs().get(partie.getOrdre().getFirst());
        while(!courant.isAJouer()){}
        List<Integer> nouveauOrdre = partie.getOrdre();
        nouveauOrdre.removeFirst();
        partie.setOrdre(nouveauOrdre);
    }

    public String jouerDevinerFaction(Partie.Cycle cycle, Joueur actionnaire, Joueur cible, String guess){
        actionnaire.setAJouer(true);
        return  joueurService.devinerFaction(cycle,actionnaire,cible,guess);
    }

    public String jouerComparer(Partie.Cycle cycle,Joueur actionnaire, Joueur cible){
        actionnaire.setAJouer(true);
        return joueurService.comparer(cycle,actionnaire,cible);
    }

    public String jouerTuer(Joueur actionnaire, Joueur cible, int guessValeur, String guessFaction, boolean veutEchanger){
        actionnaire.setAJouer(true);
        return joueurService.tuer(actionnaire, cible, guessValeur, guessFaction, veutEchanger);
    }

    public Carte jouerRegarderSaCarte(Joueur actionnaire){
        actionnaire.setAJouer(true);
        return joueurService.regarderSaCarte(actionnaire);
    }

}
