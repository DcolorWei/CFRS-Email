import { initStorageListener, storageChangeEvent } from './localstorage.ts';

// 定义消息监听器的类型
type MessageListener = (event: MessageEvent) => void;

class WebSocketClientService {
    private static instance: WebSocketClientService;
    private ws: WebSocket | null;
    private messageListeners: Set<MessageListener>;

    private constructor() {
        this.ws = null;
        this.messageListeners = new Set<MessageListener>();
        this.connect('ws://localhost:3003');
        initStorageListener();
    }

    public static getInstance(): WebSocketClientService {
        if (!WebSocketClientService.instance) {
            WebSocketClientService.instance = new WebSocketClientService();
        }
        return WebSocketClientService.instance;
    }

    public connect(url: string): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) return;
        this.ws = new WebSocket(url);
        this.ws.onmessage = (event: MessageEvent) => {
            this.messageListeners.forEach(listener => listener(event));
        };

    }
    public sendMessage(message: string): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(message);
        }
    }
}

export const wsService = WebSocketClientService.getInstance();