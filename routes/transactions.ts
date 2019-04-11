import { Request, Response, Router, NextFunction } from "express";
import { TransactionRepository } from "../database/TransactionRepository";
import { request } from "http";
import IController from "./IController";

export default class TransactionController implements IController {
   public router: Router;
   public route: string = "/transaction";
   public transactionRepository: TransactionRepository;

   constructor() {
      this.transactionRepository = new TransactionRepository();
      this.router = Router();
      this.initRoutes();
   }
   initRoutes() {
      this.router.get(`${this.route}/:userId`, (request: Request, response: Response) => this.getTransactionHistory(request, response));
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