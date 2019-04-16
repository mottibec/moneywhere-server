import crypto from "crypto";

export interface IBalance {
    currencyCode: string;
    amount: number;
    id: string;
}

export class Balance implements IBalance {
    currencyCode: string;
    amount: number;
    id: string;

    constructor(currencyCode: string, amount: number) {
        this.currencyCode = currencyCode;
        this.amount = amount;
        this.id = crypto.randomBytes(16).toString("hex");
    }

    convertTo(currencyCode: string) {
        return new Balance(currencyCode, this.amount * 3.5)
    }
}