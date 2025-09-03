import { EmailRouterInstance, EmailWebsocketInstance } from "../../shared/router/EmailRouter";
import { inject, injectws } from "../lib/inject";

export const EmailRouter = new EmailRouterInstance(inject);
export const EmailWebsocket = new EmailWebsocketInstance(injectws);