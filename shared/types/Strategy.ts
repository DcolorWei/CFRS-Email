import { BaseEntity } from "./Base";

export class StrategyEntity extends BaseEntity {
    email: string;
    site: string;
    forward: string;
    callback: string;
    comment:string;
    creater: string;
}