import { AccountEntity } from "../types/Account";
import { EmailEntity } from "../types/Email";

export interface AccountImpl extends Pick<AccountEntity, "name" | "email" | "password"> { }
export interface EmailImpl extends Pick<EmailEntity, "eid" | "from" | "to" | "subject" | "html" | "text" | "time"> { }
