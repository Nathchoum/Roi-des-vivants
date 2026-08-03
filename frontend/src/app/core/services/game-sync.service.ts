import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Partie } from '../models/partie.model';

@Injectable({ providedIn: 'root' })
export class GameSyncService {
  private channelName = 'roivivant_channel';
  private storageKey = 'roivivant_state';
  private broadcastChannel?: BroadcastChannel;
  public gameState$ = new BehaviorSubject<Partie | null>(null);
  public stateRequested$ = new Subject<void>();
  private backendUrl = 'http://localhost:8080/api/game';

  constructor(private http: HttpClient) {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.broadcastChannel = new BroadcastChannel(this.channelName);
        this.broadcastChannel.onmessage = (ev) => {
          if (ev.data?.type === 'SYNC_STATE') this.gameState$.next(ev.data.partie);
          if (ev.data?.type === 'REQUEST_STATE') this.stateRequested$.next();
        };
      } catch {}
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === this.storageKey && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue) as Partie;
            this.gameState$.next(parsed);
          } catch {}
        }
      });
    }
  }

  broadcastState(partie: Partie, room = 'default') {
    if (this.broadcastChannel) this.broadcastChannel.postMessage({ type: 'SYNC_STATE', partie });
    if (typeof window !== 'undefined') window.localStorage.setItem(this.storageKey, JSON.stringify(partie));
    // also persist to backend for cross-browser
    try {
      this.http.post(`${this.backendUrl}/save`, partie, { params: { room } }).subscribe({});
    } catch {}
  }

  requestCurrentState(room = 'default') {
    if (this.broadcastChannel) this.broadcastChannel.postMessage({ type: 'REQUEST_STATE' });
    // try backend first (cross-browser)
    this.http.get<Partie>(`${this.backendUrl}/load`, { params: { room } }).subscribe({
      next: (p) => {
        if (p) this.gameState$.next(p);
      },
      error: () => {
        // fallback to localStorage
        const raw = typeof window !== 'undefined' ? window.localStorage.getItem(this.storageKey) : null;
        if (raw) {
          try {
            this.gameState$.next(JSON.parse(raw) as Partie);
          } catch {}
        }
      }
    });
  }
}
