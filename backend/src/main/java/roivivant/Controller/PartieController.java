package roivivant.Controller;

import org.springframework.web.bind.annotation.*;
import roivivant.Models.Carte;
import roivivant.Models.Joueur;
import roivivant.Models.Partie;
import roivivant.Services.PartieService;

import java.util.List;
//TODO gerer erreur liée a valeur >11 et =11 car pas de faction dans ces cas la
@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/partie")
public class PartieController {

    private final PartieService partieService;

    public PartieController(PartieService partieService) {
        this.partieService = partieService;
    }

    @PostMapping("/initPartie")
    public Partie initPartie(@RequestBody Joueur[] joueurs) {
        return partieService.initPartie(List.of(joueurs));
    }

    @PostMapping("/devinerFaction")
    public String devinerFaction(
            @RequestBody Joueur[] duo,
            @RequestParam String guess) {
        return partieService.jouerDevinerFaction(duo[0], duo[1], guess);
    }


    @PostMapping("/comparer") //TODO a voir si get ou post
    public String comparer(@RequestBody Joueur[] duo) {
        return partieService.jouerComparer(duo[0], duo[1]);
    }

    @PostMapping("/tuer")
    public String tuer(
            @RequestBody Joueur[] duo,
            @RequestParam int guessValeur,
            @RequestParam String guessFaction,
            @RequestParam boolean veutEchanger) {
        return partieService.jouerTuer(duo[0], duo[1], guessValeur, guessFaction, veutEchanger);
    }

    @PostMapping("/regarderSaCarte")
    public Carte regarderSaCarte(@RequestBody Joueur actionnaire) {
        return partieService.jouerRegarderSaCarte(actionnaire);
    }
}