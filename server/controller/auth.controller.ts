import { AuthBody, AuthRouterInstance, LoginToken, RegisterResult } from "../../shared/router/AuthRouter";
import { inject, injectws } from "../lib/inject";
import { loginUser, registerUser } from "../service/auth.service";

async function login(requst: AuthBody): Promise<LoginToken> {
    const result = await loginUser(requst.email, requst.password);
    return result;
}

async function register(requst: AuthBody): Promise<RegisterResult> {
    const result = await registerUser(requst.email, requst.password);
    return result;
}


export const authController = new AuthRouterInstance(inject, { login, register });