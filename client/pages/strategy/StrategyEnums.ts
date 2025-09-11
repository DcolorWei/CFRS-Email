import { EmailImpl } from "../../../shared/impl";

interface KeyLable {
    key: string;
    label: string;
}

export const keyLables: Array<KeyLable> = [
    { key: "email", label: "邮箱" },
    { key: "site", label: "站内信通知" },
    { key: "webhook", label: "回调地址" },
    { key: "forward", label: "转发邮箱" },
    { key: "comment", label: "备注" },
    { key: "sms", label: "短信通知" },
    { key: "action", label: "操作" },
]
