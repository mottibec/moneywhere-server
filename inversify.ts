import { Container } from "inversify";
import { TYPES } from "./inversify.types";
import { ITransactionService } from "./services/interfaces/ITransactionService";
import TransactionService from "./services/transactionService";

const container = new Container();
container.bind<ITransactionService>(TYPES.ITransactionService).to(TransactionService);

export { container };