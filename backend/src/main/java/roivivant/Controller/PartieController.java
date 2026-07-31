package roivivant.Controller;

import org.springframework.web.bind.annotation.*;
import roivivant.Models.Carte;
import roivivant.Models.Joueur;
import roivivant.Models.Partie;
import roivivant.Services.JoueurService;
import roivivant.Services.PartieService;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/partie")
public class PartieController {

    private final PartieService partieService;

    public PartieController(PartieService partieService) {
        this.partieService = partieService;
    }

    /**
     * Action : Initialiser la partie
     * URL : POST http://localhost:8080/api/partie/initPartie
     */
    @PostMapping("/initPartie")
    public Partie initPartie(
            @RequestBody Joueur[] joueurs,
            @RequestParam String guess) {
        return partieService.initPartie(List.of(joueurs));
    }
}