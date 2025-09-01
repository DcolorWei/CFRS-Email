import { EmailImpl } from "../impl";
import { BaseRouterInstance, BaseWebsocketInstance, MessageType } from "../lib/decorator";

export class EmailRouterInstance implements BaseRouterInstance {
    base = "/api";
    prefix = "/email";
    router = [
        {
            name: "queryEmailList",
            path: "/list",
            method: "get",
            handler: Function
        },
    ]

    queryEmailList: (query: EmailListQuery) => Promise<EmailListResponse>

    constructor(inject: Function, functions?: {
        queryEmailList: (query: EmailListQuery) => Promise<EmailListResponse>,
    }) {
        inject(this, functions);
    }
}

export class EmailWebsocketInstance implements BaseWebsocketInstance {
    methods = [
        {
            name: "queryEmailList",
            type: "single",
            handler: Function
        }
    ];
    queryEmailList: (query: EmailListQuery) => Promise<EmailListResponse>;
    constructor(inject: Function, functions?: {
        queryEmailList: (query: EmailListQuery) => Promise<EmailListResponse>,
    }) {
        inject(this, functions);
    }
}

export interface EmailListQuery {
    from?: string;
    to?: string;
    page: number;
}

export interface EmailListResponse {
    success: boolean;
    list: EmailImpl[];
    total: number;
}

export interface EmailSetBody {
    name: string;
    value: string;
}

export interface EmailSetResponse {
    success: boolean;
}