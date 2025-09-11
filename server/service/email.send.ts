import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(body: { name?: string, from?: string, to: string, subject: string, html: string }) {
    const { name, from, to, subject, html } = body;
    let fromStr: string = '';
    if (name && from) {
        fromStr = `${name} <${from}>`;
    } else {
        fromStr = `System <system@${process.env.RESEND_FROM_HOST}>`
    }
    const { data, error } = await resend.emails.send({
        from: fromStr,
        to: [to],
        subject: subject,
        html: html,
    });

    if (error) {
        console.error({ error });
        return false;
    }else{
        return true;
    }
}