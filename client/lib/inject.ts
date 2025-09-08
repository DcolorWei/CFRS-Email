import { BaseRouterInstance, BaseWebsocketInstance, Route } from "../../shared/lib/decorator";
import { WebSocketClientService } from "./websocket";

export function inject(instance: BaseRouterInstance) {
    const { base, prefix, router } = instance;
    router.forEach((route: Route) => {
        const { name, path, method } = route;
        const url = base + prefix + path;
        if (method === "get") {
            instance[name] = async (query: string | string[][] | Record<string, string> | URLSearchParams | undefined) => {
                const final_url = url + "?" + new URLSearchParams(query).toString();
                return await fetch(final_url, { method: "get" })
                    .then(r => r.json())
                    .then(data => {
                        const event = new CustomEvent(name, { detail: data, bubbles: true });
                        window.dispatchEvent(event);
                    });
            }
        }
        if (method === "post") {
            instance[name] = async (body: Record<string, any>) => {
                return await fetch(url,
                    {
                        method: "post",
                        body: JSON.stringify(body),
                        headers: { "Content-Type": "application/json" }
                    })
                    .then(r => r.json())
                    .then(data => {
                        const event = new CustomEvent(name, { detail: data, bubbles: true });
                        window.dispatchEvent(event);
                    });
            }
        }
        // 置空函数
        route.handler = null;
    })
}
// export function injectws(wss: Server, controllers: BaseWebsocketInstance[]) {
export function injectws(instance: BaseWebsocketInstance) {
    if (new Set(instance.methods.map(method => method.name)).size !== instance.methods.length) {
        throw new Error("There are duplicate method names in the controller.");
    }
    const host = location.host;
    const ws = WebSocketClientService.getInstance(`wss://${host}/ws`);
    instance.methods.forEach(method => {
        const { name, type } = method;
        instance[name] = async (payload: string) => {
            const id = Date.now().toString(36);
            const message = JSON.stringify({ id, name, payload, type })
            ws.sendMessage(message);
            return id;
        }
    })

}