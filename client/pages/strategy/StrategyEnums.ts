import { EmailImpl } from "../../../shared/impl";

interface KeyLable {
    key: string;
    label: string;
}

export const keyLables: Array<KeyLable> = [
    { key: "email", label: "邮箱" },
    { key: "webhook", label: "回调地址" },
    { key: "forward", label: "转发邮箱" },
    { key: "comment", label: "备注" },
    { key: "action", label: "操作" },
]
