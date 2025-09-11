import { AuthRouterInstance } from "../../shared/router/AuthRouter";
import { EmailRouterInstance, EmailWebsocketInstance } from "../../shared/router/EmailRouter";
import { StrategyRouterInstance } from "../../shared/router/StrategyRouter";
import { inject, injectws } from "../lib/inject";

export const AuthRouter = new AuthRouterInstance(inject);
export const EmailRouter = new EmailRouterInstance(inject);
export const EmailWebsocket = new EmailWebsocketInstance(injectws);
export const StrategyRouter = new StrategyRouterInstance(inject);