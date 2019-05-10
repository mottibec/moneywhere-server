import IController from "./IController";
import { IRequest, IResponse } from "../webserver/IWebRequest";
import { inject } from "inversify";
import { TYPES } from "../inversify.types";
import { IWebServer } from "../webserver/IWebServer";

export default class PrefrencesController implements IController {
    route: string = "/pref";

    @inject(TYPES.IWebServer)
    private _webServer!: IWebServer;

    initRoutes(): void {
        this._webServer.registerProtectedPost(this.route,
            (request: IRequest, response: IResponse) =>
                this.setUserPref(request, response));
        this._webServer.registerProtectedGet(this.route,
            (request: IRequest, response: IResponse) =>
                this.getUserPref(request, response));
    }
    setUserPref(request: IRequest, response: IResponse) {

    }
    getUserPref(request: IRequest, response: IResponse) {
        const userId = request.user;
        response.json(userId);
    }

}