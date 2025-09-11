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
    const inboxSet = new Set(strategyRepository.find({ creater: account }).map(item => item.email));
    const emailList = emailRepository.find();
    const result = emailList.filter(({ to }) => inboxSet.has(to));
    return result;
}

export async function saveReceivedEmail(emails: Array<EmailImpl>): Promise<boolean> {
    const wsService = WebSocketServerService.getInstance();
    const result = emailRepository.insertMany(emails);
    emails.forEach((item) => {
        const strategy = strategyRepository.find({ email: item.to });
        strategy.forEach((sitem => {
            const starthtml = `<p>发件人: ${item.from}</p><p>收件人: ${item.to}</p><p>原文：</p>`
            sendEmail({ to: sitem.forward, subject: item.subject, html: starthtml + item.html });
        }))
    })
    wsService.triggerEvent("queryEmailList", JSON.stringify(emails));
    return result;
}

// new ImapEmailService(saveReceivedEmail);
