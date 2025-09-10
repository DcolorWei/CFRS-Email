import { BaseRouterInstance } from "../lib/decorator";

export class AuthRouterInstance implements BaseRouterInstance {
    base = "/api";
    prefix = "/auth";
    router = [
        {
            name: "login",
            path: "/login",
            method: "post",
            handler: Function
        },
        {
            name: "register",
            path: "/register",
            method: "post",
            handler: Function
        }
    ]

    login: (requst: AuthBody) => Promise<LoginToken>
    register: (requst: AuthBody) => Promise<RegisterResult>

    constructor(inject: Function, functions?: {
        login: (requst: AuthBody) => Promise<LoginToken>,
        register: (requst: AuthBody) => Promise<RegisterResult>
    }) {
        inject(this, functions);
    }
}

export interface AuthBody {
    email: string;
    password: string;
}

export interface LoginToken {
    token: string;
    success: boolean;
}

export interface RegisterResult{
    success: boolean;
}