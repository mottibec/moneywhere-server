import { Request, Response } from "express";
import IController from "./IController";
import { UserRepository } from "../database/UserRepository";
import { UserLocationService } from "../services/userLocation"
import { TYPES } from "../inversify.types";
import { inject, injectable } from "inversify";
import { ITransactionService } from "../services/interfaces/ITransactionService";
import { IWebServer } from "../webserver/IWebServer";
import "reflect-metadata";

@injectable()
export default class UserController implements IController {
    public route: string = "/user";
    private userRepository: UserRepository = new UserRepository();
    private locationService: UserLocationService = new UserLocationService();

    @inject(TYPES.IWebServer) private _webServer!: IWebServer;
    @inject(TYPES.ITransactionService) private _transactionService!: ITransactionService;
    
    initRoutes() {
        this._webServer.registerGet(this.route, (request: Request, response: Response) => this.getUsers(request, response));
        this._webServer.registerGet(`${this.route}/:id`, (request: Request, response: Response) => this.getUser(request, response));
        this._webServer.registerGet(`${this.route}/:location`, (request: Request, response: Response) => this.getUsersByLocation(request, response));
        this._webServer.registerPost(this.route, (request: Request, response: Response) => this.createUser(request, response));
        this._webServer.registerPost(`${this.route}/:id/rate`, (request: Request, response: Response) => this.rateUser(request, response));
        this._webServer.registerPost(`${this.route}/ping`, (request: Request, response: Response) => this.pingUser(request, response));
    }
    async getUsers(request: Request, response: Response) {
        let result = await this.userRepository._items;
        response.send(result);
    }
    async createUser(request: Request, response: Response) {
        let user = request.body.user;
        let result = await this.userRepository.create(user);
        let resultCode = result ? 200 : 400;
        response.status(resultCode);
    }
    async getUser(request: Request, response: Response) {
        let id = request.params.id;
        let user = await this.userRepository.findOne(id);
        response.send(user)
    }
    getUsersByLocation(request: Request, response: Response) {
        var location = request.body.location;
        var closeByUsers = this.locationService.getUsersByLocation(location, 2);
        response.send(closeByUsers)
    }
    rateUser(request: Request, response: Response) {
        let rating = request.body.rating;
        let userId = request.body.user.id;
        let user = {
            id: userId,
            rating: rating
        }
        response.send(200);
    }
    async pingUser(request: Request, response: Response) {
        let user = request.body.userId;
        await this._transactionService.pingUser(user);
        response.send(200);
    }
}