import { Request, Response } from "express";
import { TransactionRepository } from "../database/TransactionRepository";
import IController from "./IController";
import { injectable, inject } from "inversify";
import { IWebServer } from "../webserver/IWebServer";
import { TYPES } from "../inversify.types";

@injectable()
export default class TransactionController implements IController {
   public route: string = "/transaction";
   public transactionRepository: TransactionRepository;

   @inject(TYPES.IWebServer) private _webServer!: IWebServer;
   constructor() {
      this.transactionRepository = new TransactionRepository();
   }
   initRoutes() {
      this._webServer.registerGet(this.route, (request: Request, response: Response) => this.getAll(request, response));
      this._webServer.registerGet(`${this.route}/:userId`, (request: Request, response: Response) => this.getTransactionHistory(request, response));
   }
   getAll(request: Request, response: Response) {
      var items = this.transactionRepository._items;
      response.send(items);
   }
   async getTransactionHistory(request: Request, response: Response) {
      const userId = request.params.userId;
      try {
         let transactions = await this.transactionRepository.findByUser(userId);
         response.send(transactions);
      }
      catch (err) {
         console.log(err);
      }
   }
}