package roivivant.Controller;

import roivivant.Services.CarteService;
import roivivant.Models.Carte;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Arrays;

@RestController
@CrossOrigin(origins = "http://localhost:4200") // pour que le front puisse appeler le backend
@RequestMapping("/api/cartes") // route pour accéder à la classe carteController
@lombok.RequiredArgsConstructor // Génère le constructeur pour les attributs 'final'
public class CarteController {

    private final CarteService carteService; // Automatiquement injecté grâce au final !

    @GetMapping("/pool") // ajouter pool pour accéder à la méthode getPoolDeTest
    public ArrayList<Carte> getPoolDeTest() {
        ArrayList<String> factionsDeTest = new ArrayList<>(Arrays.asList("Guerriers", "Mages", "Voleurs"));
        return carteService.generePool(30, factionsDeTest);
    }
}