import IController from "./IController";
import { UserRepository } from "../database/UserRepository";
import { UserLocationService } from "../services/userLocation"
import { TYPES } from "../inversify.types";
import { inject, injectable } from "inversify";
import { ITransactionService } from "../services/interfaces/ITransactionService";
import { IWebServer } from "../webserver/IWebServer";
import { IRequest, IResponse } from "../webserver/IWebRequest";

@injectable()
export default class UserController implements IController {
    public route: string = "/user";

    @inject(TYPES.UserRepository)
    private _userRepository!: UserRepository;

    @inject(TYPES.IUserLocationService)
    private _locationService!: UserLocationService;

    @inject(TYPES.IWebServer)
    private _webServer!: IWebServer;

    @inject(TYPES.ITransactionService)
    private _transactionService!: ITransactionService;

    initRoutes() {
        this._webServer.registerGet(this.route, (request: IRequest, response: IResponse) => this.getUsers(request, response));
        this._webServer.registerGet(`${this.route}/:id`, (request: IRequest, response: IResponse) => this.getUser(request, response));
        this._webServer.registerGet(`${this.route}/:location`, (request: IRequest, response: IResponse) => this.getUsersByLocation(request, response));
        this._webServer.registerPost(this.route, (request: IRequest, response: IResponse) => this.createUser(request, response));
        this._webServer.registerPost(`${this.route}/:id/rate`, (request: IRequest, response: IResponse) => this.rateUser(request, response));
        this._webServer.registerPost(`${this.route}/ping`, (request: IRequest, response: IResponse) => this.pingUser(request, response));
    }
    async getUsers(request: IRequest, response: IResponse) {
        let result = await this._userRepository._items;
        response.send(result);
    }
    async createUser(request: IRequest, response: IResponse) {
        let user = request.body.user;
        let result = await this._userRepository.create(user);
        let resultCode = result ? 200 : 400;
        response.status(resultCode);
    }
    async getUser(request: IRequest, response: IResponse) {
        let id = request.params.id;
        let user = await this._userRepository.findOne(id);
        response.send(user)
    }
    getUsersByLocation(request: IRequest, response: IResponse) {
        var location = request.body.location;
        var closeByUsers = this._locationService.getUsersByLocation(location, 2);
        response.send(closeByUsers)
    }
    rateUser(request: IRequest, response: IResponse) {
        let rating = request.body.rating;
        let userId = request.body.user.id;
        let user = {
            id: userId,
            rating: rating
        }
        response.send(200);
    }
    async pingUser(request: IRequest, response: IResponse) {
        let user = request.body.userId;
        await this._transactionService.pingUser(user);
        response.send(200);
    }
}