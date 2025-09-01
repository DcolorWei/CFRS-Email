export type Route = { name: string; path: string; method: string; handler: Function | null; }

// HTTP 路由
export interface BaseRouterInstance {
    base: string;
    prefix: string;
    router: Array<{
        name: string;
        path: string;
        method: string;
        handler: Function | null;
    }>;
    [key: string]: any;
}

export type MessageType = "single" | "continuous";
export interface WSMessage { id: string, name: string, payload: string, type: MessageType }
export interface BaseWebsocketInstance {
    methods: Array<{
        name: string;
        type: string;
        handler: Function | null;
    }>;
}