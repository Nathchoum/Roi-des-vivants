package roivivant.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.TreeMap;
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Joueur {
    private String pseudo;
    private Etat etat;
    private boolean aJouer;
    private Carte carte;
    public Joueur(String pseudo){
        this.pseudo=pseudo;
        etat=Etat.VIVANT;
        aJouer= true;
        carte=null;
    }
    public enum Etat{
        VIVANT,
        MORT,
        ELIMINE

    }
}
