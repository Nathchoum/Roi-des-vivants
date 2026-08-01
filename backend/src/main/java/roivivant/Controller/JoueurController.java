package roivivant.Controller;

import org.springframework.web.bind.annotation.*;
import roivivant.Models.Carte;
import roivivant.Models.Joueur;
import roivivant.Models.Partie;
import roivivant.Services.JoueurService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/joueurs")
public class JoueurController {

    private final JoueurService joueurService;

    // Injection par constructeur (la recommandation officielle)
    public JoueurController(JoueurService joueurService) {
        this.joueurService = joueurService;
    }

    /**
     * Action : Deviner la faction d'un joueur
     * URL : POST http://localhost:8080/api/joueurs/deviner-faction?guess=Mages
     */
    @PostMapping("/deviner-faction")
    public String devinerFaction(
            @RequestParam Partie.Cycle cycle,
            @RequestBody Joueur[] joueurs, // Un tableau contenant [joueur1, joueur2]
            @RequestParam String guess) {

        return joueurService.devinerFaction(cycle,joueurs[0], joueurs[1], guess);
    }

    /**
     * Action : Comparer les cartes de deux joueurs
     * URL : POST http://localhost:8080/api/joueurs/comparer
     */
    @PostMapping("/comparer")
    public String comparer(@RequestParam Partie.Cycle cycle,@RequestBody Joueur[] joueurs) {
        return joueurService.comparer(cycle,joueurs[0], joueurs[1]);
    }

    /**
     * Action : Tuer un joueur
     * URL : POST http://localhost:8080/api/joueurs/tuer?guessValeur=5&guessFaction=Guerriers&veutEchanger=true
     */
    @PostMapping("/tuer")
    public String tuer(
            @RequestBody Joueur[] joueurs,
            @RequestParam int guessValeur,
            @RequestParam String guessFaction,
            @RequestParam boolean veutEchanger) {

        return joueurService.tuer(joueurs[0], joueurs[1], guessValeur, guessFaction, veutEchanger);
    }

    /**
     * Action : Regarder sa carte
     * URL : POST http://localhost:8080/api/joueurs/regarder-carte
     */
    @PostMapping("/regarder-carte")
    public Carte regarderSaCarte(@RequestBody Joueur joueur) {
        return joueurService.regarderSaCarte(joueur);
    }
}