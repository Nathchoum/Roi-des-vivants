import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { P2pService } from '../../core/services/p2p.service';
import { PartieService } from '../../core/services/partie.service';
import { Etat, Joueur } from '../../core/models/joueur.model';

@Component({
  selector: 'app-acceuil',
  standalone: true,
  templateUrl: './acceuil.html',
  styleUrl: './acceuil.css',
})
export class AcceuilComponent implements OnInit {
  public p2pService = inject(P2pService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private partieService = inject(PartieService);

  public isLinkCopied = signal<boolean>(false);
  public isCodeCopied = signal<boolean>(false);
  
  ngOnInit(): void {
    // Read ?room=XXXXXX query parameter from URL
    this.route.queryParams.subscribe(async (params) => {
      const roomCode = params['room'];

      if (roomCode) {
        // Auto-join if URL contains room code
        console.log('🔗 URL Room detected:', roomCode);
        await this.p2pService.joinRoom(roomCode);
      }
    });
  }

  public async createLobby(): Promise<void> {
    await this.p2pService.initHost();
  }

  public copyShareLink(): void {
    const link = this.p2pService.lienRoom();
    if (!link) return;

    navigator.clipboard.writeText(link).then(() => {
      this.isLinkCopied.set(true);
      setTimeout(() => this.isLinkCopied.set(false), 2000);
    });
  }
  public copyCode(): void {
    const code = this.p2pService.roomCode();
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      this.isCodeCopied.set(true);
      setTimeout(() => this.isCodeCopied.set(false), 2000);
    });
  }



    
  
}