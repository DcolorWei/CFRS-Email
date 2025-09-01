import { Express, Request, Response } from "express";
import { BaseRouterInstance, BaseWebsocketInstance } from "../../shared/lib/decorator";
import { Server } from "ws";

export function inject(instance: BaseRouterInstance, functions: Function[]) {
    instance.router.forEach((route) => {
        const { name, path, method } = route;
        const targetFc = functions?.[name];
        if (targetFc) {
            instance[name] = targetFc;
            route.handler = targetFc;
        } else {
            throw new Error(`${name} is not defined in functions`);
        }
    });
}

export function injectws(instance: BaseWebsocketInstance, functions: Function[]) {
    instance.methods.forEach(route => {
        const { name } = route;
        const targetFc = functions?.[name];
        if (targetFc) {
            instance[name] = targetFc;
            route.handler = targetFc;
        } else {
            throw new Error(`${name} is not defined in functions`);
        }
    });
}

// export function injectws(wss: Server, controllers: BaseWebsocketInstance[]) {
//     const allMethods = controllers.flatMap(controller => controller.methods);
//     if (new Set(allMethods.map(method => method.name)).size !== allMethods.length) {
//         throw new Error("There are duplicate method names in the controller.");
//     }
//     wss.on('connection', ws => {
//         ws.on('message', async message => {
//             const msg: { id: string, name: string, payload: string } = JSON.parse(message.toString());
//             const { handler } = allMethods.find(method => method.name === msg.name)!;
//             if (!handler) {
//                 ws.send(JSON.stringify({
//                     requestId: msg.id,
//                     success: false,
//                     error: "Method not found."
//                 }));
//                 return;
//             } else {
//                 const result = await handler(msg.payload);
//                 ws.send(JSON.stringify({
//                     requestId: msg.id,
//                     success: true,
//                     payload: result
//                 }));
//             }
//         });
//     });
// }