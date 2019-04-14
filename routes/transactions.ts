import { TransactionRepository } from "../database/TransactionRepository";
import IController from "./IController";
import { injectable, inject } from "inversify";
import { IWebServer } from "../webserver/IWebServer";
import { TYPES } from "../inversify.types";
import { IRequest, IResponse } from "../webserver/IWebRequest";

@injectable()
export default class TransactionController implements IController {
   public route: string = "/transaction";

   @inject(TYPES.TransactionRepository)
   private _transactionRepository!: TransactionRepository;

   @inject(TYPES.IWebServer)
   private _webServer!: IWebServer;

   initRoutes() {
      this._webServer.registerGet(this.route, (request: IRequest, response: IResponse) => this.getAll(request, response));
      this._webServer.registerGet(`${this.route}/:userId`, (request: IRequest, response: IResponse) => this.getTransactionHistory(request, response));
   }
   getAll(request: IRequest, response: IResponse) {
      var items = this._transactionRepository._items;
      response.send(items);
   }
   async getTransactionHistory(request: IRequest, response: IResponse) {
      const userId = request.params.userId;
      try {
         let transactions = await this._transactionRepository.findByUser(userId);
         response.send(transactions);
      }
      catch (err) {
         console.log(err);
      }
   }
}