import { Express, Request, Response } from "express";
import { BaseRouterInstance, BaseWebsocketInstance, WSMessage } from "../../shared/lib/decorator";
import { Server } from "ws";
import { wsService } from "./webscoket";

export function mounthttp(expressApp: Express, controllers: BaseRouterInstance[]) {
    const interfaceList: Array<{ base: string, prefix: string, path: string, method: string }> = [];
    for (const controller of controllers) {
        console.log(`Controller ${controller.prefix} is registering with ${controller.router.length} routes.`);
        const { base, prefix, router } = controller;
        for (const item of router) {
            const { path, method, handler } = item;
            if (interfaceList.some(item => item.prefix === prefix && item.path === path && item.method === method)) {
                throw new Error(`Duplicate route found: ${prefix}${path} with method ${method}`);
            } else {
                interfaceList.push({ base, prefix, path, method });
            }
            if (!handler || typeof handler !== "function") {
                throw new Error(`Handler method "${method}" for route ${prefix}${path} is not valid.`);
            }
            if (!(method === "get" || method === "post" || method === "put" || method === "delete")) {
                throw new Error(`Invalid method ${method} for route ${prefix}${path}. Supported methods are: get, post, put, delete.`);
            }
            expressApp[method](`${base}${prefix}${path}`, async (req: Request, res: Response) => {
                switch (method) {
                    case "get":
                        res.send(await handler(req.query));
                        break;
                    case "post":
                        res.send(await handler(req.body));
                        break;
                }
            });
        }
    }
}

export function mountws(wss: Server, controllers: BaseWebsocketInstance[]) {
    const allMethods = controllers.flatMap(controller => controller.methods);
    if (new Set(allMethods.map(method => method.name)).size !== allMethods.length) {
        throw new Error("There are duplicate method names in the controller.");
    } else {
        allMethods.forEach(method => {
            console.log(`Websocket [${method.name}] is registering.`);
        });
    }
    wss.on('connection', ws => {
        const id = wsService.addClient(ws);
        console.log(`Client ${id} connected.`);
        ws.on('message', async message => {
            const msg: WSMessage = JSON.parse(message.toString());
            console.log(`Received message from client ${id}: ${JSON.stringify(msg)}`);
            const { handler } = allMethods.find(method => method.name === msg.name)!;
            if (!handler) {
                const result = JSON.stringify({ requestId: msg.id, success: false, error: "Method not found." });
                wsService.sendMessage(id, result);
            } else {
                const result = JSON.stringify({ requestId: msg.id, success: true, payload: await handler(msg.payload) });
                wsService.sendMessage(id, result);
            }
        });
    });
}