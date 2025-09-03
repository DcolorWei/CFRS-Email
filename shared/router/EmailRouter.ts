import { EmailImpl } from "../impl";
import { BaseRouterInstance, BaseWebsocketInstance, MethodConstructor } from "../lib/decorator";

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

export class EmailWebsocketInstance extends BaseWebsocketInstance {
    methods = [
        {
            name: "queryEmailList",
            type: "continuous",
            handler: Function
        }
    ];
    queryEmailList: (query: EmailListQuery) => Promise<string>;
    constructor(inject: Function, functions?: {
        queryEmailList: (query: EmailListQuery) => Promise<EmailListResponse>,
    }) { super(); inject(this, functions); }
}

export interface EmailListQuery {
    from?: string;
    to?: string;
    page: number;
}

export interface EmailListResponse {
    list: EmailImpl[];
    total: number;
}