import fs from "fs";
import { simpleParser } from 'mailparser';
import { StrategyEntity } from "../../shared/types/Strategy";
import Repository from "../lib/respository";
import { EmailImpl } from "../../shared/impl";
import { sendEmail } from "./email.send";
const strategyRepository = Repository.instance(StrategyEntity);

setInterval(async () => {
    const strategies = await strategyRepository.find();
    strategies.forEach(async strategy => {
        const name = strategy.email.split("@")[0];
        const emailList = await getMailsByName(name, true);
        emailList.forEach(email => {
            email.html = [`<html><body>`,
                `<p>发件人:${email.from.replace(/[\<\>]/g, "")}</p>`,
                `<p>收件人:${email.to.replace(/[\<\>]/g, "")}</p>`,
                `<div>${email.html}<div>`,
                `</body></html>`].join("").trim();
            sendEmail({
                name,
                from: email.from,
                to: strategy.forward,
                subject: email.subject,
                html: email.html,
            })
        })

    })
}, 1000 * 60 * 1);
export async function getEmailList(account: string): Promise<EmailImpl[]> {
    const inboxSet = new Set((await strategyRepository.find({ creater: account })).map(item => item.email));
    const emailList: EmailImpl[] = [];
    const inboxArray = Array.from(inboxSet);
    for (const email of inboxArray) {
        const emails = await getMailsByName(email.split("@")[0])
        emailList.push(...emails);
    }
    const result = emailList;
    return result;
}

async function getMailsByName(name: string, latest_flag = false): Promise<EmailImpl[]> {
    const dir = `/home/${name}/Maildir/new`
    if (!fs.existsSync(dir)) {
        return [];
    }
    const files = fs.readdirSync(dir).filter(file => {
        if (!latest_flag) return true;
        const filePath = `/home/${name}/Maildir/new/${file}`;
        const fileTime = new Date(fs.statSync(filePath).ctime).getTime();
        return Date.now() - fileTime < 60 * 1000;
    })
    const result = await Promise.all(files.map(async (file, index) => {
        const filePath = `/home/${name}/Maildir/new/${file}`;
        const content = fs.readFileSync(filePath, 'utf8');
        const email = await simpleParser(content);
        if (!email) return null;
        const from = JSON.parse(JSON.stringify(email.headers.get("from"))).text;
        const to = JSON.parse(JSON.stringify(email.headers.get("to"))).text;
        const subject = email.headers.get("subject");
        const time = String(new Date(String(email.headers.get("date"))).getTime());
        const { html, text } = email;
        return { eid: index, from, to, subject, time, html, text, } as EmailImpl;
    }));
    return result.filter(item => item !== null);
}