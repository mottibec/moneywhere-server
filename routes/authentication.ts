import IController from "./IController";
import { TYPES } from "../inversify.types";
import { IWebServer } from "../webserver/IWebServer";
import { inject, multiInject, injectable } from "inversify";
import { IAuthProvider } from "../services/authProvider";
import { IRequest, IResponse } from "../webserver/IWebRequest";
import { User } from "../models/user";
import { UserService } from "../services/userService";
import JWTService from "../services/jwtService";
import AuthService from "../services/authService";

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

    @inject(TYPES.AuthService)
    private _authService!: AuthService;

    initRoutes(): void {
        this._providers.forEach(provider => provider.register(this._webServer, this.route));
        this._webServer.registerPost(`${this.route}/signUp`, (request: IRequest, response: IResponse) =>
            this.signUp(request, response));
        this._webServer.registerProtectedGet(`${this.route}/test`, this.testProdected);
    }
    async signUp(request: IRequest, response: IResponse) {
        const signUpData = request.body;
        const savedUser = await this._userService.findByEmail(signUpData.email);
        if (savedUser) {
            return response
                .status(400)
                .json({
                    error: "The email address you have entered is already registered"
                });
        }

        let user = await this.createUser(signUpData);
        const result = await this._userService.createUser(user);
        if (result) {
            var token = this._tokenService.sign({ id: user.id });
            response.send(token);
        }
        response.status(400);
    }
    async createUser(signUpData: any): Promise<User> {
        let user = new User(signUpData.name, signUpData.email);
        user.phone = signUpData.phone;
        user.gender = signUpData.gender;
        user.mainCurrencyCode = signUpData.currencyCode;
        user.countryCode = signUpData.countryCode;
        user.password = await this._authService.hash(signUpData.password);
        return user;
    }
    testProdected(request: IRequest, response: IResponse) {
        response.json({ name: "motti" });
    }
}