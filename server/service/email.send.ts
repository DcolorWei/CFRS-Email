import { exec } from 'child_process';
import { promisify } from 'util';

import dotenv from 'dotenv';

import fs from 'fs';
dotenv.config();
const execAsync = promisify(exec);

export async function sendEmail(body: { name?: string, from?: string, to: string, subject: string, html: string }) {
    const { name, from, to, subject, html } = body;

    let fromStr = `System <system@${process.env.FROM_HOST}>`;

    // 创建临时文件
    const tempFile = `${Math.random().toString(36).substring(7)}.html`
    try {
        // 写入 HTML 内容到临时文件
        fs.writeFileSync(tempFile, html);

        // 使用 mail 命令发送（从文件读取内容）
        const command = `mail -s "${subject}" -a "From: ${fromStr}" -a "Content-Type: text/html" ${to} < ${tempFile}`;
        const { stderr } = await execAsync(command);

        if (stderr) {
            console.error({ error: stderr });
            return false;
        }
        return true;
    } catch (error) {
        console.error({ error });
        return false;
    } finally {
        fs.unlinkSync(tempFile);
    }
}