import { Injectable, Inject, PLATFORM_ID, NgZone, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { Peer, DataConnection } from 'peerjs';

@Injectable({
  providedIn: 'root'
})
export class P2pService {

    private peer: Peer | null = null;

    //Variables joueurs
    public peerId = signal<string | null>(null);
    public pseudo = signal<string>('Joueur');
    public estHost = signal<boolean>(false); 
    public estConnecte = signal<boolean>(false);
    public roomCode = signal<string |null >(null);

    //Variables Room
    public lienRoom = signal<string | null>(null);
    public connectionError = signal<string | null>(null);
    public joueursPresents = signal<Map<string, string>>(new Map());
    public partieCommencee = signal<boolean>(false);


    // La Map technique pour envoyer/recevoir les données
    private connections: Map<string, DataConnection> = new Map();

    constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone
    ) {}


    public async initHost(): Promise<string> {
        const roomCode = this.genererCodeRoom(6);
        this.roomCode.set(roomCode);
        await this.startPeer(roomCode);
        this.estHost.set(true);
        // Génération du lien de partage URL
        const url = new URL(window.location.href);
        url.searchParams.set('room', roomCode);
        this.lienRoom.set(url.toString());
        this.joueursPresents.set(new Map([[this.peerId()!, this.pseudo()]]));
        return roomCode;
    }

    // 2. Initialisation Client et connexion au Host
    public async joinRoom(hostCode: string): Promise<void> {
        if (!this.peer) {
            await this.startPeer();
        }
        this.estHost.set(false);
        this.connectToHost(hostCode.toUpperCase().trim());
    }

    private async startPeer(customId?: string): Promise<void> {
        if (!isPlatformBrowser(this.platformId)) return;

        const { Peer } = await import('peerjs');
        this.peer = customId ? new Peer(customId) : new Peer();

        return new Promise((resolve) => {
            this.peer!.on('open', (id: string) => {
            this.zone.run(() => {
                console.log('✅ Peer ID:', id);
                this.peerId.set(id);
                resolve();
            });
            });

            // Écoute des connexions entrantes (Côté Host)
            this.peer!.on('connection', (conn: DataConnection) => {
            this.estHost.set(true);
            this.registerConnection(conn);
            });

            this.peer!.on('error', (err: any) => {
            this.zone.run(() => {
                if (err.type === 'unavailable-id') {
                this.connectionError.set('Code de room déjà pris. Réessayez.');
                } else {
                this.connectionError.set(err.type);
                }
            });
            });
        });
    }

    private connectToHost(hostId: string): void {
        if (!this.peer || !hostId) return;
        const conn = this.peer.connect(hostId);
        this.registerConnection(conn);
    }

    private registerConnection(conn: DataConnection): void {
        conn.on('open', () => {
            this.zone.run(() => {
                this.connections.set(conn.peer, conn);
                this.estConnecte.set(true);

                if (!this.estHost()) {
                    conn.send({ type: 'JOIN', pseudo: this.pseudo() });
                }
            });
        });

        // Écoute des données reçues (ex: synchronisation de la liste des joueurs)
        conn.on('data', (data: any) => {
            this.zone.run(() => {
                // Le Host reçoit le pseudo d'un joueur qui rejoint
                if (data?.type === 'JOIN' && this.estHost()) { //This = host
                    this.joueursPresents.update(map => new Map(map).set(conn.peer, data.pseudo));
                    this.broadcast({ type: 'SYNC_PEERS', peers: Array.from(this.joueursPresents().entries()),roomCode: this.roomCode() });
                } 
                
                // Les Clients mettent à jour leur liste reçue du Host
                else if (data?.type === 'SYNC_PEERS') {
                    if (Array.isArray(data.peers)) {
                        this.joueursPresents.set(new Map(data.peers)); // 👈 Reconstruit la Map à partir du tableau
                    }
                    if (data.roomCode) {
                        this.roomCode.set(data.roomCode);
                    }
                }
                else if(data?.type === 'START_GAME' && this.estHost()){
                    this.broadcast({type : "START_GAME",partieCommencee: this.partieCommencee()});
                }
                else if(data?.type === 'START_GAME'){
                    const etat = data.partieCommencee ?? true;
                    this.partieCommencee.set(etat);
                }
            });
        });

        conn.on('close', () => {//TODO fix room bug when deco of not host and fix when host dc no host remains
            this.zone.run(() => {
            // 1. Supression de la Map
             if (this.estHost()) {
                this.joueursPresents.update(map => {
                    const next = new Map(map);
                    next.delete(conn.peer);
                    return next;
                });
                this.broadcast({ type: 'SYNC_PEERS', peers: this.joueursPresents() });
            }
            

            if (this.connections.size === 0) this.estConnecte.set(false);
            });
        });
    }


    public commencerPartie():boolean{
        this.partieCommencee.set(true)
        this.broadcast({type: 'START_GAME',partieCommencee: true });
        return false;
    }
    // Envoi d'un message à TOUS les pairs connectés
    public broadcast(data: any): void {
        this.connections.forEach((conn) => {
            if (conn.open) {
            conn.send(data);
            }
        });
    }

    public genererCodeRoom(length = 6): string {
        const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    setPseudo(pseudo:string) {
        this.pseudo.set(pseudo);
        console.log(this.pseudo())
    }
}