import { StrategyImpl } from "../../shared/impl";
import { StrategyEntity } from "../../shared/types/Strategy";
import Repository from "../lib/respository";
import { sendEmail } from "./email.send";

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

const strategyRepository = Repository.instance(StrategyEntity);

export async function getStrategyList(creater: string): Promise<StrategyEntity[]> {
    return strategyRepository.find({ creater });
}

export async function saveStrategy(email: string, forward: string, callback: string, comment: string, creater: string): Promise<boolean> {
    const exist = strategyRepository.findOne({ email, creater });
    if (!forward || forward.length === 0) {
        forward = creater;
    }
    if (exist) {
        strategyRepository.update({ email, creater }, { forward, callback, comment });
    } else {
        strategyRepository.insert({ email, forward, callback, comment, creater });
    }
    if(!fs.existsSync(`/root/create_mail.sh`)){
        return true;
    }
    const name = email.split("@")[0];
    try {
        const command = `/root/create_mail.sh ${name}`;
        const { stderr } = await execAsync(command);

        if (stderr) {
            console.error({ error: stderr });
        }
    } catch (error) {
        console.error({ error });
    }
    const html = `<p>邮箱策略 ${email} 已更新</p><p>该邮箱的所有邮件都将通过本路径向此邮箱转发</p>`
    sendEmail({ to: forward, subject: "邮箱策略更新", html });
    return true;
}

export async function deleteStrategy(email: string, creater: string): Promise<boolean> {
    const exist = strategyRepository.findOne({ email, creater });
    if (exist) {
        strategyRepository.delete({ email, creater });
    }
    return true;
}