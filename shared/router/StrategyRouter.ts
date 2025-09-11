import { StrategyImpl } from "../impl";
import { BaseRequest, BaseRouterInstance } from "../lib/decorator";

export class StrategyRouterInstance extends BaseRouterInstance {
    base = "/api";
    prefix = "/stategy";
    router = [
        {
            name: "queryStrategyList",
            path: "/list",
            method: "get",
            handler: Function
        },
        {
            name: "requestSaveStrategy",
            path: "/save",
            method: "post",
            handler: Function
        },
    ]

    queryStrategyList: (query: StrategyListQuery, callback?: Function) => Promise<StrategyListResponse>
    requestSaveStrategy: (request: StrategyBodyRequest, callback?: Function) => Promise<StrategySaveResponse>

    constructor(inject: Function, functions?: {
        queryStrategyList: (query: StrategyListQuery) => Promise<StrategyListResponse>,
        requestSaveStrategy: (request: StrategyBodyRequest) => Promise<StrategySaveResponse>
    }) { super(); inject(this, functions); }
}

export interface StrategyListQuery extends BaseRequest {
    page: number;
}

export interface StrategyListResponse {
    list: StrategyImpl[];
    total: number;
}

export interface StrategyBodyRequest extends BaseRequest {
    email: string;
    forward: string;
    callback: string;
    comment: string;
}

export interface StrategySaveResponse {
    success: boolean;
}