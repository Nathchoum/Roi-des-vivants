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

    public String jouerUnTour(){

    }

    public String jouerDevinerFaction(){

    }

    public String jouerComparer(){

    }

    public String jouerTuer(){

    }

    public String jouerRegarderSaCarte(){

    }

}
