package roivivant.Services;

import lombok.Data;
import org.springframework.stereotype.Service;
import roivivant.Models.Partie;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
@Data
@Service
public class GameStateService {
    private final Map<String, Partie> states = new ConcurrentHashMap<>();

    public void saveState(String room, Partie partie) {
        if (room == null) room = "default";
        states.put(room, partie);
    }

    public Partie loadState(String room) {
        if (room == null) room = "default";
        return states.get(room);
    }
}
