export interface IBalance {
    currencyCode: string;
    amount: number;
}

export class Balance implements IBalance {
    currencyCode: string;
    amount: number;

    constructor(currencyCode: string, amount: number) {
        this.currencyCode = currencyCode;
        this.amount = amount;
    }

    convertTo(currencyCode: string) {
        return new Balance(currencyCode, this.amount * 3.5)
    }
}