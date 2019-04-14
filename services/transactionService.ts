import { injectable, inject } from "inversify";
import { ITransactionService } from "./interfaces/ITransactionService";
import { TransactionRepository } from "../database/TransactionRepository";
import { TYPES } from "../inversify.types";

@injectable()
export default class TransactionService implements ITransactionService {
    @inject(TYPES.TransactionRepository)
    private _transactionRepository!: TransactionRepository;

    GetAll() {
        return this._transactionRepository._items;
    }

    async getUserTransactions(userId: string) {
        return this._transactionRepository.findByUser(userId);
    };

    pingUser(userId: string) {

    }
}