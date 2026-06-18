package roivivant.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor // constructeur avec tout les arguments de la classe
@NoArgsConstructor // constructeur sans argument (pas utile pour l'instant)
@Data //pour getter et setter
public class Carte {
    private int valeur;
    private String faction;
}
