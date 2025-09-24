import { EmailImpl } from "../../shared/impl";
import { EmailListQuery, EmailListResponse, EmailOtpQuery, EmailOtpResponse, EmailRouterInstance, EmailSenderBody, EmailSenderResponse, EmailUrlQuery, EmailUrlResponse, EmailWebsocketInstance } from "../../shared/router/EmailRouter";
import { inject, injectws } from "../lib/inject";
import { verifytoken } from "../service/auth.service";
import { sendEmail } from "../service/email.send";
import { getEmailList, getRecentOtp, getRecentUrls } from "../service/email.service";

async function queryEmailList(query: EmailListQuery): Promise<EmailListResponse> {
    if (!query.auth || !query.page) {
        return { list: [], total: 0 }
    }
    const email = verifytoken(query.auth);
    if (!email) {
        return { list: [], total: 0 }
    }
    const list: Array<EmailImpl> = [];
    list.push(...await getEmailList(email));
    list.reverse();
    const result: EmailListResponse = {
        list: list,
        total: list.length,
    }
    return result;
}

async function requestOtp(query: EmailOtpQuery): Promise<EmailOtpResponse> {
    const otp = await getRecentOtp(query.email) || "";
    return { otp };
}

async function requestUrl(query: EmailUrlQuery): Promise<EmailUrlResponse> {
    const url = await getRecentUrls(query.email, query.keyword) || "";
    return { url };
}

async function requestSendMail(body: EmailSenderBody): Promise<EmailSenderResponse> {
    const success = await sendEmail(body);
    return { success };
}

export const emailController = new EmailRouterInstance(inject, { queryEmailList, requestOtp, requestUrl, requestSendMail });
export const emailWSController = new EmailWebsocketInstance(injectws, { queryEmailList });