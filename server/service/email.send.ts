import { exec } from 'child_process';
import { promisify } from 'util';

import dotenv from 'dotenv';

import fs from 'fs';
dotenv.config();
const execAsync = promisify(exec);

import nodemailer from 'nodemailer';

export async function sendEmail(body: { name?: string, to: string, subject: string, html: string }) {
    const { name, to, subject, html } = body;

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.resend.com',
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: true, // 465端口使用SSL
        auth: {
            user: process.env.SMTP_USER || "resend", // 您的企业邮箱地址
            pass: process.env.SMTP_PASS || "******"
        }
    });

    let fromEmail = `system@${process.env.FROM_HOST}`;
    let fromName = 'System';

    if (name) {
        fromEmail = `${name}@${process.env.FROM_HOST}`.toLocaleLowerCase();
        fromName = name;
    }

    try {
        const info = await transporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`,
            to: to,
            subject: subject,
            html: html
        });

        console.log('邮件发送成功:', info.messageId);
        return true;
    } catch (error) {
        console.error('邮件发送失败:', error);
        return false;
    }
}