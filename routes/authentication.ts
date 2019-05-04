import IController from "./IController";
import { TYPES } from "../inversify.types";
import { IWebServer } from "../webserver/IWebServer";
import { inject, multiInject, injectable } from "inversify";
import { IAuthProvider } from "../services/authProvider";
import { IRequest, IResponse } from "../webserver/IWebRequest";

@injectable()
export default class authenticationController implements IController {
    route: string = "/auth";

    @inject(TYPES.IWebServer)
    private _webServer!: IWebServer;

    @multiInject(TYPES.IAuthProvider)
    private _providers!: IAuthProvider[];

    initRoutes(): void {
        this._providers.forEach(provider => provider.register(this._webServer));
        this._webServer.registerGet(`${this.route}/signUp`, this.signUp);
        this._webServer.registerProtectedGet(`${this.route}/test`, this.testProdected);
    }
    signUp(request: IRequest, response: IResponse) {
        response.send(200);

    }
    testProdected(request: IRequest, response: IResponse) {
        response.json({ name: "motti" });
    }


}