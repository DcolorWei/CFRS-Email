import { WebSocket } from "ws";

class WebSocketServerService {
    private static instance: WebSocketServerService;

    private clients: Array<{
        id: string,
        ws: WebSocket,
        connect_time: number
    }> = [];

    private constructor() {
        this.clients = [];
        setInterval(() => {
            this.clients = this.clients.filter(client => Date.now() - client.connect_time < 1000 * 60 * 5);
        }, 1000 * 60);
    }

    public static getInstance(): WebSocketServerService {
        if (!WebSocketServerService.instance) {
            WebSocketServerService.instance = new WebSocketServerService();
        }
        return WebSocketServerService.instance;
    }
    public addClient(ws: WebSocket): string {
        const id = Date.now().toString(36).slice(4, 10) + Math.random().toString(36).slice(4, 10);
        const connect_time = Date.now();
        this.clients.push({ id, ws, connect_time });
        return id;
    }

    public keepAlive(id: string): void {
        const client = this.clients.find(client => client.id === id);
        if (client) client.connect_time = Date.now();
    }

    public sendMessage(id: string, message: string): void {
        const client = this.clients.find(client => client.id === id);
        if (!client) { return }
        client.ws.send(message);
    }
}

export const wsService = WebSocketServerService.getInstance();