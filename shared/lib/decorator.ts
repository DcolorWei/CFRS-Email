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
export type MethodConstructor = { name: string; type: string; handler: Function | null; };
export interface WSMessage { id: string, name: string, payload: string, type: string }
export class BaseWebsocketInstance {
    methods: Array<MethodConstructor>;
    [key: string]: MethodConstructor[] | ((...args: any) => Promise<string>);
}