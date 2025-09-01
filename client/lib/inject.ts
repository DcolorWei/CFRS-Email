import { BaseRouterInstance, BaseWebsocketInstance, Route } from "../../shared/lib/decorator";
import { Server } from "ws";

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
                    .then(data => data);
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
                    .then(data => data);
            }
        }
        // 置空函数
        route.handler = null;
    })
}
export function injectws(wss: Server, controllers: BaseWebsocketInstance[]) {
    const allMethods = controllers.flatMap(controller => controller.methods);
    if (new Set(allMethods.map(method => method.name)).size !== allMethods.length) {
        throw new Error("There are duplicate method names in the controller.");
    }
    wss.on('connection', ws => {
        ws.on('message', async message => {
            const msg: { id: string, name: string, payload: string } = JSON.parse(message.toString());
            const { handler } = allMethods.find(method => method.name === msg.name)!;
            if (!handler) {
                ws.send(JSON.stringify({
                    requestId: msg.id,
                    success: false,
                    error: "Method not found."
                }));
                return;
            } else {
                const result = await handler(msg.payload);
                ws.send(JSON.stringify({
                    requestId: msg.id,
                    success: true,
                    payload: result
                }));
            }
        });
    });
}