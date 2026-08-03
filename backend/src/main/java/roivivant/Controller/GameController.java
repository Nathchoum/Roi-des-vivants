package roivivant.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import roivivant.Models.Partie;
import roivivant.Services.GameStateService;

import java.io.Console;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/game")
public class GameController {

    private final GameStateService gameStateService;

    public GameController(GameStateService gameStateService) {
        this.gameStateService = gameStateService;
    }

    @PostMapping("/save")
    public ResponseEntity<Void> saveState(@RequestParam(required = false) String room, @RequestBody Partie partie) {
        System.out.println("GameController: saveState called for room='" + room + "' partieId='" + (partie!=null?partie.getIdPartie():"null") + "'");
        gameStateService.saveState(room, partie);
        System.out.println("GameController: saveState called for room='" + gameStateService.getStates().size());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/load")
    public ResponseEntity<Partie> loadState(@RequestParam(required = false) String room) {
        System.out.println("GameController: loadState called for room='" + room + "'");
        Partie p = gameStateService.loadState(room);
        if (p == null) {
            System.out.println("GameController: no state found for room='" + room + "'");
            return ResponseEntity.notFound().build();
        }
        System.out.println("GameController: returning state for room='" + room + "' partieId='" + p.getIdPartie() + "'");
        return ResponseEntity.ok(p);
    }
}
