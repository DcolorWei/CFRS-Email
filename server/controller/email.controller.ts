import { EmailImpl } from "../../shared/impl";
import { EmailListQuery, EmailListResponse, EmailRouterInstance, EmailWebsocketInstance } from "../../shared/router/EmailRouter";
import { inject, injectws } from "../lib/inject";
import { getEmailByEmail, getEmailList } from "../service/email.service";

async function queryEmailList(query: EmailListQuery): Promise<EmailListResponse> {
    const list: Array<EmailImpl> = [];
    list.push(...await getEmailList());
    list.reverse();
    const result: EmailListResponse = {
        list: list,
        total: list.length,
    }
    return result;
}


export const emailController = new EmailRouterInstance(inject, { queryEmailList });
export const emailWSController = new EmailWebsocketInstance(injectws, { queryEmailList });