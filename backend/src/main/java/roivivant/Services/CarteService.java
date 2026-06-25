package roivivant.Services;
import roivivant.Models.Carte;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CarteService {
    /**
     * @param fact le nom de la faction des cartes à générer
     * @return une liste de 10 cartes appartenant à cette faction
     */
    public ArrayList<Carte> genereFaction(String fact){
        ArrayList<Carte> faction = new ArrayList<>();
        for (int i =0; i<=9; i++){
        faction.add(new Carte(i+1, fact));
        }
        return faction;
    }
    /**
     * @param facts liste des noms de faction à générer
     * @param nbCartes le pool choisit : 20, 30, 40
     * /!\ le 11 représente actuellement le joker, on verra plus tard si on modifie
     * @return le pool commplet
     */
    public ArrayList<Carte> generePool(int nbCartes, ArrayList<String> facts){
        if (nbCartes == 20 || nbCartes == 30 || nbCartes == 40){
            ArrayList<Carte> Pool = new ArrayList<>();
            for (int i = 0; i < nbCartes/10; i++) {
                ArrayList<Carte> nouvelleFaction = genereFaction(facts.get(i));
                Pool.addAll(nouvelleFaction);
            }
            Pool.add(new Carte(11, "joker"));
            return Pool;
        }
        else{
            return new ArrayList<>();
        }
    }
}
