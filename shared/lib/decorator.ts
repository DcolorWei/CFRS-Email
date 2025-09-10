export type Route = { name: string; path: string; method: string; handler: Function | null; }

export type HTTPMethodConstructor = { name: string; path: string; method: string; handler: Function | null; };
export class BaseRouterInstance {
    base: string;
    prefix: string;
    router: Array<{
        name: string;
        path: string;
        method: string;
        handler: Function | null;
    }>;
    [key: string]: string | HTTPMethodConstructor[] | ((...args: any) =>  Promise<any>);
}

export type WSMethodConstructor = { name: string; type: string; handler: Function | null; };

export interface WSMessage { id: string, name: string, payload: string, type: string }

export class BaseWebsocketInstance {
    methods: Array<WSMethodConstructor>;
    [key: string]: WSMethodConstructor[] | ((...args: any) => Promise<any>);
}