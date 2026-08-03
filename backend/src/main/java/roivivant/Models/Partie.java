package roivivant.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Array;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Partie {
    private UUID idPartie;
    private Cycle cycle;
    private List<Joueur> joueurs;
    private List<Carte> pile;
    private int tours;
    private List<Integer> ordre;

    // Constructeur pratique pour démarrer une nouvelle partie
    public Partie(List<Joueur> joueurs, List<Carte> pile) {
        this.idPartie = UUID.randomUUID(); // Génère l'UUID automatiquement
        this.cycle = Cycle.JOUR;
        this.joueurs = joueurs;
        this.pile = pile;
        this.tours = 1;
        ordre=new ArrayList<>();
        for(int i = 0;i<joueurs.size();i++) ordre.add(i);
        Collections.shuffle(ordre);
    }
    public enum Cycle {
        JOUR,
        NUIT
    }
}

