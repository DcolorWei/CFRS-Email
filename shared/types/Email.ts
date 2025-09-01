import { BaseEntity } from "./Base";

export class EmailEntity extends BaseEntity {
    eid: number | string;
    from: string;
    to: string;
    subject: string;
    html: string;
    text: string;
    time: string;
}