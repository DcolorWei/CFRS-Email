import { EmailEntity } from "../types/Email";

export interface EmailImpl extends Pick<EmailEntity, "eid" | "from" | "to" | "subject" | "html" | "text" | "time"> { }
