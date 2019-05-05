import IController from "./IController";
import { TYPES } from "../inversify.types";
import { IWebServer } from "../webserver/IWebServer";
import { inject, multiInject, injectable } from "inversify";
import { IAuthProvider } from "../services/authProvider";
import { IRequest, IResponse } from "../webserver/IWebRequest";
import { User } from "../models/user";
import { UserService } from "../services/userService";
import JWTService from "../services/jwtService";

@injectable()
export default class authenticationController implements IController {
    route: string = "/auth";

    @inject(TYPES.IWebServer)
    private _webServer!: IWebServer;

    @multiInject(TYPES.IAuthProvider)
    private _providers!: IAuthProvider[];

    @inject(TYPES.UserService)
    private _userService!: UserService;

    @inject(TYPES.JWTService)
    private _tokenService!: JWTService;

    initRoutes(): void {
        this._providers.forEach(provider => provider.register(this._webServer, this.route));
        this._webServer.registerPost(`${this.route}/signUp`, (request: IRequest, response: IResponse) =>
            this.signUp(request, response));
        this._webServer.registerProtectedGet(`${this.route}/test`, this.testProdected);
    }
    async signUp(request: IRequest, response: IResponse) {
        const signUpData = request.body;
        let user = new User(signUpData.name, signUpData.email);
        user.phone = signUpData.phone;
        user.gender = signUpData.gender;
        const savedUser = await this._userService.findByEmail(user.email);
        if (savedUser) {
            return response.status(400);
        }
        const result = await this._userService.createUser(user);
        if (result) {
            var token = this._tokenService.sign({ id: user.id });
            response.send(token);
        }
        response.status(400);

    }
    testProdected(request: IRequest, response: IResponse) {
        response.json({ name: "motti" });
    }


}