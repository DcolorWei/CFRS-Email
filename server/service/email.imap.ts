import Imap from 'imap';
import { simpleParser } from 'mailparser';
import 'dotenv/config';

import { EmailImpl } from '../../shared/impl';

// 从环境变量中获取配置
const imapConfig = {
    user: process.env.EMAIL!,
    password: process.env.IMAP_PASSWORD!,
    host: process.env.IMAP_SERVER!,
    port: Number(process.env.IMAP_PORT)!,
    tls: true, // 启用 TLS/SSL
};


function openInboxAndStartIdle(imap: Imap, callback: (emails: Array<EmailImpl>) => void) {
    imap.openBox('INBOX', false, (err, box) => {
        if (err) throw err;
        checkNewEmails(imap, callback);
        imap.on('mail', () => {
            checkNewEmails(imap, callback);
        });
    });
}

async function parsedMailFromMsg(imap: Imap, msg: Imap.ImapMessage) {
    const origin = await new Promise<string>((r) => {
        let ck = '';
        msg.on('body', (stream) => {
            stream.on('data', chunk => ck += chunk.toString('utf8'));
            stream.once('end', async () => r(ck));
        });
        msg.once('attributes', (attrs) => {
            setTimeout(() => {
                imap.addFlags(attrs.uid, ['\\Seen'], () => { });
            }, 5000)
        });
    });
    const parsed = await simpleParser(origin);
    // 由于是转发服务，to比较特殊
    let parsedTo = Array.isArray(parsed.to) ? parsed.to.map(t => t.text).join(',') : parsed.to?.text || '';
    if (parsedTo.split("<").length > 1) {
        parsedTo = parsedTo.split("<")[1].split(">")[0];
    }
    const email = {
        eid: parsed.messageId || Math.random().toString().slice(2, 10),
        from: parsed.from?.text || '',
        to: parsedTo,
        subject: parsed.subject || '',
        html: parsed.html ? parsed.html.trim() : '',
        text: parsed.text ? parsed.text.trim() : '',
        time: String(parsed.date ? new Date(parsed.date).getTime() : Date.now()),
    };
    return email;
}

async function checkNewEmails(imap: Imap, callback: (emails: Array<EmailImpl>) => void) {
    const unseens = await new Promise<number[]>((resolve) => {
        imap.search(['UNSEEN'], (err, uids) => {
            if (err) resolve([]);
            resolve(uids);
        });
    });
    if (!unseens.length) return [];

    const f = imap.fetch(unseens, { bodies: '' });
    const emails = await new Promise<Array<EmailImpl>>(async (r) => {
        const emails: Array<any> = [];
        f.on('message', async msg => {
            const email = await parsedMailFromMsg(imap, msg);
            emails.push(email) === unseens.length && r(emails);
        });
    });
    callback(emails);
}


export class ImapEmailService {
    private imap: Imap;

    constructor(callback: (emails: Array<EmailImpl>) => void) {
        this.imap = new Imap(imapConfig);
        this.imap.once('error', (e: Error) => {
            console.error('Connection error:', e);
            setTimeout(() => {
                this.imap.connect();
            }, 5000)
        });
        this.imap.once('end', () => {
            console.log('Connection ended. Attempting to reconnect...');
            setTimeout(() => {
                this.imap.connect();
            }, 5000)
        });
        this.imap.once('ready', () => { openInboxAndStartIdle(this.imap, callback) });
        this.imap.connect();

        setInterval(async () => {
            const unseens = await new Promise<number[]>((resolve) => {
                this.imap.search(['SEEN'], (err, uids) => {
                    if (err) resolve([]);
                    resolve(uids);
                });
            });
            console.log(new Date(), 'Alive Success, fetch unseens:', unseens.length);
        }, 10 * 60 * 1000); // 每10分钟一次
    }
}