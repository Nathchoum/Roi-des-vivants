package roivivant.Models;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class Joueur {
    private String pseudo;
    private String etat;
    private Carte carte;
}
