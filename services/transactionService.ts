import { injectable, inject } from "inversify";
import { ITransactionService } from "./interfaces/ITransactionService";

@injectable()
export default class TransactionService implements  ITransactionService {
    pingUser(userId: string) {
        
    }
}