import { AccountEntity } from "../types/Account";
import { EmailEntity } from "../types/Email";
import { StrategyEntity } from "../types/Strategy";

export interface AccountImpl extends Pick<AccountEntity, "name" | "email" | "password"> { }
export interface EmailImpl extends Pick<EmailEntity, "eid" | "from" | "to" | "subject" | "html" | "text" | "time"> { }
export interface StrategyImpl extends Pick<StrategyEntity, "email" | "site" | "forward" | "callback" | "creater" | "comment"> { }