import { AuthBody, AuthRouterInstance, LoginToken, RegisterResult } from "../../shared/router/AuthRouter";
import { inject, injectws } from "../lib/inject";
import { loginUser, registerUser } from "../service/auth.service";

async function login(request: AuthBody): Promise<LoginToken> {
    const result = await loginUser(request.email, request.password);
    return result;
}

async function register(request: AuthBody): Promise<RegisterResult> {
    const result = await registerUser(request.email, request.password);
    return result;
}


export const authController = new AuthRouterInstance(inject, { login, register });