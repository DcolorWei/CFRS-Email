import fs from "fs";
import { StrategyEntity } from "../../shared/types/Strategy";
import Repository from "../lib/respository";
import { EmailImpl } from "../../shared/impl";
import { sendEmail } from "./email.send";
const strategyRepository = Repository.instance(StrategyEntity);

setInterval(async () => {
    const strategies = await strategyRepository.find();
    strategies.forEach(async strategy => {
        const name = strategy.email.split("@")[0];
        const emailList = getMailsByName(name, true);
        emailList.forEach(email => {
            console.log("wait", email)
            email.html = `<html><body>
            <p>发件人:${email.from.replace(/[\<\>]/g, "")}</p>
            <p>收件人:${email.to.replace(/[\<\>]/g, "")}</p>
            <div>${email.html}<div>
            </body></html>`
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
    Array.from(inboxSet).forEach(async email => {
        const emails = getMailsByName(email.split("@")[0])
        emailList.push(...emails);
    });
    const result = emailList;
    return result;
}

function parseEmail(rawEmail: string) {
    const headerEnd = rawEmail.indexOf('\n\n');
    const headers = headerEnd >= 0 ? rawEmail.slice(0, headerEnd) : '';
    const body = headerEnd >= 0 ? rawEmail.slice(headerEnd + 2) : rawEmail;

    const headerObj: any = {};
    headers.split('\n').forEach((line: string) => {
        if (line.trim() === '') return;
        const colonIndex = line.indexOf(':');
        if (colonIndex > -1) {
            const key = line.slice(0, colonIndex).trim();
            const value = line.slice(colonIndex + 1).trim();
            headerObj[key] = value;
        }
    });

    let decodedBody = decodeBody(body, headerObj);
    let text = "";
    let html = "";
    if (decodedBody.includes('Content-Transfer-Encoding: quoted-printable')) {
        const textMailId = decodedBody.split("\n")[0];
        const textArr = decodedBody.split(textMailId);
        html = textArr[2].replace(/=\r?\n/g, '')
            .replace(/=([0-9A-F]{2})/gi, (_, hex) =>
                String.fromCharCode(parseInt(hex, 16))
            )
            .replace(textMailId, '')
            .replace("Content-Type: text/html; charset=UTF-8", "")
            .replace("Content-Transfer-Encoding: quoted-printable", "")
    }
    if (decodedBody.includes('Content-Transfer-Encoding: base64') || decodedBody.includes('Content-Transfer-Encoding: 7bit')) {
        const textMailId = decodedBody.split("\n")[0];
        const bodyList = decodedBody.split(textMailId);
        bodyList.forEach((item, index) => {
            if (item.includes("Content-Type: text/plain") && item.includes("Content-Transfer-Encoding: base64")) {
                const textBody = Buffer.from(item
                    .replaceAll("\n", "")
                    .replace("Content-Type: text/plain; charset=UTF-8", "")
                    .replace("Content-Transfer-Encoding: base64", "")
                ).toString("utf-8");
                text = Buffer.from(textBody, 'base64').toString('utf-8');
            }
            if (item.includes("Content-Type: text/plain") && item.includes("Content-Transfer-Encoding: 7bit")) {
                const textBody = Buffer.from(item
                    .replaceAll("\n", "")
                    .replace("Content-Type: text/plain; charset=UTF-8", "")
                    .replace("Content-Transfer-Encoding: 7bit", "")
                ).toString("utf-8");
                text = textBody;
            }
            if (item.includes("Content-Type: text/html") && item.includes("Content-Transfer-Encoding: base64")) {
                const textBody = Buffer.from(item
                    .replaceAll("\n", "")
                    .replace("Content-Type: text/html; charset=UTF-8", "")
                    .replace("Content-Transfer-Encoding: base64", "")
                ).toString("utf-8");
                html = Buffer.from(textBody, 'base64').toString('utf-8');
            }
            if (item.includes("Content-Type: text/html") && item.includes("Content-Transfer-Encoding: 7bit")) {
                const textBody = Buffer.from(item
                    .replaceAll("\n", "")
                    .replace("Content-Type: text/html; charset=UTF-8", "")
                    .replace("Content-Transfer-Encoding: 7bit", "")
                ).toString("utf-8");
                html = textBody;
            }
        });
    } else if (decodedBody.trim().startsWith("<html>")) {
        html = decodedBody.trim();
    }

    return {
        headers: headerObj,
        body: decodedBody,
        text,
        html
    };
}

function decodeBody(body: string, headers: any) {
    const encoding = headers['Content-Transfer-Encoding'] || '';
    if (encoding.toLowerCase() === 'base64') {
        return Buffer.from(body, 'base64').toString('utf8');
    }
    else if (encoding.toLowerCase() === 'quoted-printable') {
        return body.replace(/=\r?\n/g, '')
            .replace(/=([0-9A-F]{2})/gi, (_, hex) =>
                String.fromCharCode(parseInt(hex, 16)));
    }
    return body;
}

function decodeMime(encodedStr: string) {
    const match = encodedStr.match(/^=\?([^\?]+)\?Q\?([^\?]+)\?=$/i);
    if (!match) return encodedStr;

    const charset = match[1];
    const encodedText = match[2];

    const bytes = [];
    let i = 0;
    while (i < encodedText.length) {
        if (encodedText[i] === '=' && i + 2 < encodedText.length) {
            const hex = encodedText.substring(i + 1, i + 3);
            bytes.push(parseInt(hex, 16));
            i += 3;
        } else {
            bytes.push(encodedText.charCodeAt(i));
            i++;
        }
    }
    return Buffer.from(bytes).toString(charset as BufferEncoding);
}

function getMailsByName(name: string, latest_flag = false): EmailImpl[] {
    const dir = `/home/${name}/Maildir/new`
    if (!fs.existsSync(dir)) {
        console.log("no such directory", dir)
        return [];
    }
    const files = fs.readdirSync(dir).filter(file => {
        if (!latest_flag) return true;
        const filePath = `/home/${name}/Maildir/new/${file}`;
        const fileTime = new Date(fs.statSync(filePath).ctime).getTime();
        return Date.now() - fileTime < 60 * 1000;
    })
    return files.map((file, index) => {
        const filePath = `/home/${name}/Maildir/new/${file}`;
        const content = fs.readFileSync(filePath, 'utf8');
        const email = parseEmail(content);
        if (email.headers["Subject"].startsWith("=?UTF-8?")) {
            const encodedMime = email.headers["Subject"];
            const finalString = decodeMime(encodedMime);
            email.headers["Subject"] = finalString;
        }
        return {
            eid: index,
            from: email.headers["From"],
            to: email.headers["To"],
            subject: email.headers["Subject"],
            time: String(new Date(email.headers["Date"]).getTime()),
            html: email.html,
            text: email.text,
        };
    });
}