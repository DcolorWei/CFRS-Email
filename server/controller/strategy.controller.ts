import { StrategyBodyRequest, StrategyListQuery, StrategyListResponse, StrategyRouterInstance, StrategySaveResponse } from "../../shared/router/StrategyRouter";
import { inject, injectws } from "../lib/inject";
import { verifytoken } from "../service/auth.service";
import { getStrategyList, saveStrategy } from "../service/strategy.service";

async function queryStrategyList(query: StrategyListQuery): Promise<StrategyListResponse> {
    if (!query.auth || !query.page) {
        return { list: [], total: 0 }
    }
    const email = verifytoken(query.auth);
    if (!email) {
        return { list: [], total: 0 }
    }
    const list = await getStrategyList(email);
    return { list, total: list.length };
}

async function requestSaveStrategy(query: StrategyBodyRequest): Promise<StrategySaveResponse> {
    if (!query.auth) {
        return { success: false }
    }
    const email = verifytoken(query.auth);
    if (!email) {
        return { success: false }
    }
    const result = await saveStrategy(query.email, query.forward, query.callback, query.comment, email);
    return { success: result };
}

export const strategyController = new StrategyRouterInstance(inject, { queryStrategyList, requestSaveStrategy });