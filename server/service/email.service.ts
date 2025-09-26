import { EmailImpl } from "../../shared/impl";
import { EmailEntity } from "../../shared/types/Email";
import { StrategyEntity } from "../../shared/types/Strategy";
import Repository from "../lib/respository";
import { WebSocketServerService } from "../lib/webscoket";
import { sendEmail } from "./email.send";

import { ImapEmailService } from "./email.imap";

const emailRepository = Repository.instance(EmailEntity);
const strategyRepository = Repository.instance(StrategyEntity);


export async function getEmailList(account: string): Promise<EmailEntity[]> {
    const inboxSet = new Set((await strategyRepository.find({ creater: account })).map(item => item.email));
    const emailList = await emailRepository.find();
    const result = emailList.filter(({ to }) => inboxSet.has(to));
    return result;
}

export async function getRecentOtp(email: string): Promise<string | null> {
    const emails = await emailRepository.find({ to: email });
    const recentEmail = emails.reduce((prev, curr) => {
        if (curr.time > prev.time) return curr
        return prev;
    });
    if (Date.now() - recentEmail.create_time < 60 * 1000) {
        const match = recentEmail.text.match(/\b\d{4,6}\b/);
        if (match) return match[0];
    }
    return null;
}
export async function getRecentUrls(email: string, filterStr: string): Promise<string | null> {
    const emails = await emailRepository.find({ to: email });
    const recentEmail = emails.reduce((prev, curr) => {
        if (curr.time > prev.time) return curr
        return prev;
    });
    if (Date.now() - recentEmail.create_time < 60 * 1000) {
        const match = recentEmail.text.match(/(https?:\/\/[^\s]+)/g) || [];
        const filteredUrls = match.filter(url => url.includes(filterStr));
        return filteredUrls[0];
    }
    return null;
}

export async function saveReceivedEmail(emails: Array<EmailImpl>): Promise<boolean> {
    const wsService = WebSocketServerService.getInstance();
    const result = emailRepository.insertMany(emails);
    for (const item of emails) {
        const strategy = await strategyRepository.find({ email: item.to });
        strategy.forEach((sitem => {
            const starthtml = `<p>发件人: ${item.from}</p><p>收件人: ${item.to}</p><p>原文：</p>`
            sendEmail({ to: sitem.forward, subject: item.subject, html: starthtml + item.html });
        }))
    }
    wsService.triggerEvent("queryEmailList", JSON.stringify(emails));
    return result;
}

// new ImapEmailService(saveReceivedEmail);
