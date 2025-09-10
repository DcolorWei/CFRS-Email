import { EmailImpl } from "../../shared/impl";
import { EmailEntity } from "../../shared/types/Email";
import Repository from "../lib/respository";
import { WebSocketServerService } from "../lib/webscoket";
import { ImapEmailService } from "./email.imap";

const emailRepository = Repository.instance(EmailEntity);

export async function getEmailList(): Promise<EmailEntity[]> {
    return emailRepository.find();
}

export async function getEmailByEmail(email: string): Promise<Array<EmailImpl>> {
    const emails_send = emailRepository.find({ from: email });
    const emails_recieve = emailRepository.find({ to: email });
    const emailResult: Array<EmailImpl> = [...emails_send, ...emails_recieve].map(email => {
        return { ...email }
    });
    return emailResult;
}

export async function saveReceivedEmail(emails: Array<EmailImpl>): Promise<boolean> {
    const wsService = WebSocketServerService.getInstance();
    const result = emailRepository.insertMany(emails);
    wsService.triggerEvent("queryEmailList", JSON.stringify(emails));
    return result;
}