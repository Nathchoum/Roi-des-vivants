package Services;
import models.Carte;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CarteService {
    public ArrayList<Carte> genereFaction(String fact){
        ArrayList<Carte> faction = new ArrayList<>();
        for (int i =0; i<=9; i++){
        faction.add(new Carte(i+1, fact));
        }
        return faction;
    }
    public ArrayList<Carte> generePool(int nbCartes, ArrayList<String> facts){
        if (nbCartes == 20 || nbCartes == 30 || nbCartes == 40){
            ArrayList<Carte> Pool = new ArrayList<>();
            for (int i = 1; i<=nbCartes/10; i++){
                ArrayList<Carte> nouvelleFaction = genereFaction(facts.get(i));
                Pool.addAll(nouvelleFaction);
            }
            return Pool;
        }
        else{
            return new ArrayList<>();
        }
    }
}
