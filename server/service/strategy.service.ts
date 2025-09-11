import { StrategyImpl } from "../../shared/impl";
import { StrategyEntity } from "../../shared/types/Strategy";
import Repository from "../lib/respository";
import { sendEmail } from "./email.send";

const strategyRepository = Repository.instance(StrategyEntity);

export async function getStrategyList(creater: string): Promise<StrategyEntity[]> {
    console.log("getStrategyList", creater);
    console.log(strategyRepository.find())
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
    const html =`<p>邮箱策略 ${email} 已更新</p><p>该邮箱的所有邮件都将通过本路径向此邮箱转发</p>`
    sendEmail(forward, "邮箱策略更新", html);
    return true;
}